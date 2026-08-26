import { Router, type IRouter } from "express";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import { sendMail, type MailAttachment } from "../lib/mailer";

const router: IRouter = Router();

const CONTACT_EMAIL = "mail@productarmor.com";
const HR_EMAIL = "hr@productarmor.com";

const workspaceRoot = process.cwd().endsWith(path.join("artifacts", "api-server"))
  ? path.resolve(process.cwd(), "../..")
  : process.cwd();

const submissionsDir = path.resolve(workspaceRoot, "artifacts/api-server/data/submissions");
const resumesDir = path.resolve(submissionsDir, "resumes");

function appendSubmission(file: string, entry: Record<string, unknown>): void {
  fs.mkdirSync(submissionsDir, { recursive: true });
  const target = path.resolve(submissionsDir, file);
  let list: unknown[] = [];
  try {
    list = JSON.parse(fs.readFileSync(target, "utf-8"));
    if (!Array.isArray(list)) list = [];
  } catch {
    list = [];
  }
  list.push(entry);
  fs.writeFileSync(target, JSON.stringify(list, null, 2));
}

function cleanString(value: unknown, maxLen: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLen) : "";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple per-IP rate limiting: max 5 submissions per 10 minutes per endpoint.
const rateBuckets = new Map<string, number[]>();
function rateLimited(key: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const hits = (rateBuckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= 5) {
    rateBuckets.set(key, hits);
    return true;
  }
  hits.push(now);
  rateBuckets.set(key, hits);
  return false;
}

const RESUME_TYPES: Record<string, Buffer> = {
  ".pdf": Buffer.from("%PDF"),
  ".doc": Buffer.from([0xd0, 0xcf, 0x11, 0xe0]),
  ".docx": Buffer.from([0x50, 0x4b, 0x03, 0x04]),
};
const MAX_RESUME_BYTES = 10 * 1024 * 1024;

router.post("/contact", async (req, res): Promise<void> => {
  const body = req.body ?? {};

  // Honeypot: silently accept bot submissions without processing them.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    res.json({ ok: true });
    return;
  }

  const name = cleanString(body.name, 200);
  const company = cleanString(body.company, 200);
  const email = cleanString(body.email, 320);
  const message = cleanString(body.message, 5000);

  if (!name || !company || !email || !message) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }
  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ error: "Please provide a valid email address." });
    return;
  }
  if (rateLimited(`contact:${req.ip}`)) {
    res.status(429).json({ error: "Too many submissions. Please try again later." });
    return;
  }

  const entry = {
    name,
    company,
    email,
    message,
    submittedAt: new Date().toISOString(),
  };
  appendSubmission("contact.json", entry);

  let emailed = false;
  try {
    emailed = await sendMail({
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `Website contact form: ${name} (${company})`,
      text: [
        "New contact form submission from the Product Armor website:",
        "",
        `Name: ${name}`,
        `Company: ${company}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
        "",
        `Submitted at: ${entry.submittedAt}`,
      ].join("\n"),
    });
  } catch (err) {
    req.log.error({ err }, "Contact form email delivery failed");
  }

  req.log.info({ emailed }, "Contact form submission stored");
  res.json({ ok: true, emailed });
});

router.post("/careers/apply", async (req, res): Promise<void> => {
  const body = req.body ?? {};

  if (typeof body.website === "string" && body.website.trim() !== "") {
    res.json({ ok: true });
    return;
  }

  const name = cleanString(body.name, 200);
  const email = cleanString(body.email, 320);
  const phone = cleanString(body.phone, 40);
  const position = cleanString(body.position, 200);
  const message = cleanString(body.message, 5000);

  if (!name || !email || !phone || !position || !message) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }
  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ error: "Please provide a valid email address." });
    return;
  }
  if (rateLimited(`careers:${req.ip}`)) {
    res.status(429).json({ error: "Too many submissions. Please try again later." });
    return;
  }

  // Optional resume: { filename, data } with base64 or data-URL content.
  let resumePath: string | null = null;
  let attachment: MailAttachment | undefined;
  const resume = body.resume;
  if (resume && typeof resume === "object") {
    const filename = cleanString(resume.filename, 255);
    const raw = typeof resume.data === "string" ? resume.data : "";
    // Reject oversized payloads before decoding (base64 inflates ~4/3).
    if (raw.length > Math.ceil((MAX_RESUME_BYTES * 4) / 3) + 1024) {
      res.status(400).json({ error: "Resume must be 10 MB or smaller." });
      return;
    }
    const base64 = raw.includes(",") ? raw.slice(raw.indexOf(",") + 1) : raw;
    const ext = path.extname(filename).toLowerCase();
    const magic = RESUME_TYPES[ext];
    if (!filename || !magic) {
      res.status(400).json({ error: "Resume must be a PDF, DOC or DOCX file." });
      return;
    }
    let content: Buffer;
    try {
      content = Buffer.from(base64, "base64");
    } catch {
      res.status(400).json({ error: "Resume file could not be read." });
      return;
    }
    if (content.length === 0 || content.length > MAX_RESUME_BYTES) {
      res.status(400).json({ error: "Resume must be between 1 byte and 10 MB." });
      return;
    }
    if (!content.subarray(0, magic.length).equals(magic)) {
      res.status(400).json({ error: "Resume file content does not match its type." });
      return;
    }
    fs.mkdirSync(resumesDir, { recursive: true });
    const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    resumePath = path.resolve(resumesDir, safeName);
    fs.writeFileSync(resumePath, content);
    attachment = { filename, content };
  }

  const entry = {
    name,
    email,
    phone,
    position,
    message,
    resume: resumePath ? path.basename(resumePath) : null,
    submittedAt: new Date().toISOString(),
  };
  appendSubmission("applications.json", entry);

  let emailed = false;
  try {
    emailed = await sendMail({
      to: HR_EMAIL,
      replyTo: email,
      subject: `Job application: ${name} — ${position}`,
      text: [
        "New job application from the Product Armor website:",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Position: ${position}`,
        "",
        "Cover note:",
        message,
        "",
        attachment ? `Resume attached: ${attachment.filename}` : "No resume attached.",
        `Submitted at: ${entry.submittedAt}`,
      ].join("\n"),
      attachments: attachment ? [attachment] : undefined,
    });
  } catch (err) {
    req.log.error({ err }, "Job application email delivery failed");
  }

  req.log.info({ emailed }, "Job application stored");
  res.json({ ok: true, emailed });
});

// Admin-only: review stored submissions.
router.get("/submissions/:kind", async (req, res): Promise<void> => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin access not configured" });
    return;
  }
  if (req.headers.authorization !== `Bearer ${adminPassword}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const kind = req.params.kind === "applications" ? "applications.json" : "contact.json";
  try {
    const data = JSON.parse(fs.readFileSync(path.resolve(submissionsDir, kind), "utf-8"));
    res.json(data);
  } catch {
    res.json([]);
  }
});

export default router;

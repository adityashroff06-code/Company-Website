import { Router, type IRouter } from "express";
import path from "path";
import { Buffer } from "buffer";
import { sendMail, type MailAttachment } from "../lib/mailer";
import { getPool } from "../lib/db";

const router: IRouter = Router();

const CONTACT_EMAIL = "mail@productarmor.com";
const HR_EMAIL = "hr@productarmor.com";

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

function requireAdmin(authHeader: string | undefined): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  return Boolean(adminPassword) && authHeader === `Bearer ${adminPassword}`;
}

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

  const submittedAt = new Date().toISOString();
  const insert = await getPool().query(
    `INSERT INTO contact_submissions (name, company, email, message) VALUES ($1, $2, $3, $4) RETURNING id`,
    [name, company, email, message],
  );
  const submissionId = insert.rows[0].id as number;

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
        `Submitted at: ${submittedAt}`,
      ].join("\n"),
    });
  } catch (err) {
    req.log.error({ err }, "Contact form email delivery failed");
  }
  if (emailed) {
    await getPool().query(`UPDATE contact_submissions SET emailed = true WHERE id = $1`, [submissionId]);
  }

  req.log.info({ emailed, submissionId }, "Contact form submission stored");
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
    attachment = { filename, content };
  }

  const submittedAt = new Date().toISOString();
  const insert = await getPool().query(
    `INSERT INTO job_applications (name, email, phone, position, message, resume_filename, resume_data)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [name, email, phone, position, message, attachment?.filename ?? null, attachment?.content ?? null],
  );
  const submissionId = insert.rows[0].id as number;

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
        `Submitted at: ${submittedAt}`,
      ].join("\n"),
      attachments: attachment ? [attachment] : undefined,
    });
  } catch (err) {
    req.log.error({ err }, "Job application email delivery failed");
  }
  if (emailed) {
    await getPool().query(`UPDATE job_applications SET emailed = true WHERE id = $1`, [submissionId]);
  }

  req.log.info({ emailed, submissionId }, "Job application stored");
  res.json({ ok: true, emailed });
});

// Admin-only: review stored submissions.
router.get("/submissions/:kind", async (req, res): Promise<void> => {
  if (!requireAdmin(req.headers.authorization)) {
    res.status(process.env.ADMIN_PASSWORD ? 401 : 503).json({ error: "Unauthorized" });
    return;
  }
  if (req.params.kind === "applications") {
    const result = await getPool().query(
      `SELECT id, name, email, phone, position, message, resume_filename, emailed, created_at
       FROM job_applications ORDER BY created_at DESC LIMIT 500`,
    );
    res.json(result.rows);
    return;
  }
  const result = await getPool().query(
    `SELECT id, name, company, email, message, emailed, created_at
     FROM contact_submissions ORDER BY created_at DESC LIMIT 500`,
  );
  res.json(result.rows);
});

// Admin-only: download a stored resume.
router.get("/submissions/applications/:id/resume", async (req, res): Promise<void> => {
  if (!requireAdmin(req.headers.authorization)) {
    res.status(process.env.ADMIN_PASSWORD ? 401 : 503).json({ error: "Unauthorized" });
    return;
  }
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const result = await getPool().query(
    `SELECT resume_filename, resume_data FROM job_applications WHERE id = $1`,
    [id],
  );
  const row = result.rows[0];
  if (!row || !row.resume_data) {
    res.status(404).json({ error: "No resume for this application" });
    return;
  }
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${String(row.resume_filename ?? "resume").replace(/["\\]/g, "_")}"`,
  );
  res.setHeader("Content-Type", "application/octet-stream");
  res.send(row.resume_data);
});

export default router;

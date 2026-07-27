import express, { Router, type IRouter, type Request } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const router: IRouter = Router();

const workspaceRoot = process.cwd().endsWith(path.join("artifacts", "api-server"))
  ? path.resolve(process.cwd(), "../..")
  : process.cwd();

const dataFile = path.resolve(workspaceRoot, "artifacts/api-server/data/management-team.json");
const uploadsDir = path.resolve(workspaceRoot, "artifacts/api-server/data/uploads");

export type TeamMember = {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  shortDescription: string;
  biography: string;
  qualifications: string;
  experience: string;
  linkedinUrl: string;
  email: string;
  phone: string;
  profilePhoto: string;
  displayOrder: number;
  featured: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

function readMembers(): TeamMember[] {
  try {
    const raw = fs.readFileSync(dataFile, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TeamMember[]) : [];
  } catch {
    return [];
  }
}

function writeMembers(members: TeamMember[]): void {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(members, null, 2));
}

function isAuthorized(req: Request): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "productarmor2024";
  return req.headers.authorization === `Bearer ${adminPassword}`;
}

function sortMembers(members: TeamMember[]): TeamMember[] {
  return [...members].sort((a, b) => a.displayOrder - b.displayOrder);
}

function sanitizeMember(body: Record<string, unknown>, existing?: TeamMember): Omit<TeamMember, "id" | "createdAt" | "updatedAt"> {
  const str = (key: string, fallback = ""): string =>
    typeof body[key] === "string" ? (body[key] as string) : (existing ? (existing as unknown as Record<string, string>)[key] : fallback);
  const num = (key: string, fallback: number): number =>
    typeof body[key] === "number" && Number.isFinite(body[key]) ? (body[key] as number) : fallback;
  const bool = (key: string, fallback: boolean): boolean =>
    typeof body[key] === "boolean" ? (body[key] as boolean) : fallback;

  const statusRaw = body.status;
  const status: "active" | "inactive" =
    statusRaw === "active" || statusRaw === "inactive" ? statusRaw : (existing?.status ?? "active");

  return {
    fullName: str("fullName").trim(),
    designation: str("designation").trim(),
    department: str("department"),
    shortDescription: str("shortDescription"),
    biography: str("biography"),
    qualifications: str("qualifications"),
    experience: str("experience"),
    linkedinUrl: str("linkedinUrl"),
    email: str("email"),
    phone: str("phone"),
    profilePhoto: str("profilePhoto"),
    displayOrder: num("displayOrder", existing?.displayOrder ?? 0),
    featured: bool("featured", existing?.featured ?? false),
    status,
  };
}

// Detect image type from magic bytes; returns extension or null if not a supported image.
function detectImageExt(buf: Buffer): string | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return ".jpg";
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return ".png";
  if (buf.length >= 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return ".webp";
  if (buf.length >= 6 && ["GIF87a", "GIF89a"].includes(buf.subarray(0, 6).toString("ascii"))) return ".gif";
  return null;
}

// Serve uploaded profile photos at /api/uploads/<file>
router.use("/uploads", express.static(uploadsDir, { maxAge: "1d" }));

// List members. Public: active only, sorted. Admin (?all=1 + auth): everything.
router.get("/management-team", async (req, res): Promise<void> => {
  const members = sortMembers(readMembers());
  if (req.query.all === "1") {
    if (!isAuthorized(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.json(members);
    return;
  }
  res.json(members.filter(m => m.status === "active"));
});

router.get("/management-team/:id", async (req, res): Promise<void> => {
  const member = readMembers().find(m => m.id === req.params.id);
  if (!member || (member.status !== "active" && !isAuthorized(req))) {
    res.status(404).json({ error: "Member not found" });
    return;
  }
  res.json(member);
});

router.post("/management-team", async (req, res): Promise<void> => {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const body = req.body;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const data = sanitizeMember(body as Record<string, unknown>);
  if (!data.fullName || !data.designation) {
    res.status(400).json({ error: "fullName and designation are required" });
    return;
  }
  const members = readMembers();
  const now = new Date().toISOString();
  const member: TeamMember = {
    id: crypto.randomUUID(),
    ...data,
    displayOrder:
      typeof (body as Record<string, unknown>).displayOrder === "number"
        ? data.displayOrder
        : members.reduce((max, m) => Math.max(max, m.displayOrder), 0) + 1,
    createdAt: now,
    updatedAt: now,
  };
  members.push(member);
  writeMembers(members);
  req.log.info({ memberId: member.id }, "Management team member created");
  res.status(201).json(member);
});

router.put("/management-team/:id", async (req, res): Promise<void> => {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const body = req.body;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const members = readMembers();
  const index = members.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Member not found" });
    return;
  }
  const existing = members[index];
  const updated: TeamMember = {
    ...existing,
    ...sanitizeMember(body as Record<string, unknown>, existing),
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  members[index] = updated;
  writeMembers(members);
  req.log.info({ memberId: updated.id }, "Management team member updated");
  res.json(updated);
});

// Bulk reorder: [{ id, displayOrder }]
router.put("/management-team-order", async (req, res): Promise<void> => {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const orders = req.body;
  if (!Array.isArray(orders)) {
    res.status(400).json({ error: "Expected an array of { id, displayOrder }" });
    return;
  }
  const members = readMembers();
  const now = new Date().toISOString();
  for (const entry of orders) {
    if (!entry || typeof entry !== "object") continue;
    const { id, displayOrder } = entry as { id?: unknown; displayOrder?: unknown };
    if (typeof id !== "string" || typeof displayOrder !== "number") continue;
    const member = members.find(m => m.id === id);
    if (member) {
      member.displayOrder = displayOrder;
      member.updatedAt = now;
    }
  }
  writeMembers(members);
  res.json(sortMembers(members));
});

router.delete("/management-team/:id", async (req, res): Promise<void> => {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const members = readMembers();
  const index = members.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Member not found" });
    return;
  }
  const [removed] = members.splice(index, 1);
  writeMembers(members);
  req.log.info({ memberId: removed.id }, "Management team member deleted");
  res.json({ success: true });
});

// Photo upload: JSON { filename, data } where data is a base64 string or data URL.
router.post("/management-team/upload", async (req, res): Promise<void> => {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { data } = (req.body ?? {}) as { filename?: unknown; data?: unknown };
  if (typeof data !== "string" || data.length === 0) {
    res.status(400).json({ error: "Missing image data" });
    return;
  }
  const base64 = (data.includes(",") ? data.slice(data.indexOf(",") + 1) : data).replace(/\s/g, "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64) || base64.length % 4 !== 0) {
    res.status(400).json({ error: "Invalid base64 data" });
    return;
  }
  const buffer = Buffer.from(base64, "base64");
  if (buffer.length === 0 || buffer.length > 8 * 1024 * 1024) {
    res.status(400).json({ error: "Image must be between 1 byte and 8 MB" });
    return;
  }
  const ext = detectImageExt(buffer);
  if (!ext) {
    res.status(400).json({ error: "File is not a supported image (JPEG, PNG, WebP or GIF)" });
    return;
  }
  const name = `team-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, name), buffer);
  req.log.info({ file: name, bytes: buffer.length }, "Team photo uploaded");
  res.status(201).json({ url: `/api/uploads/${name}` });
});

export default router;

import { Router, type IRouter } from "express";
  import fs from "fs";
  import path from "path";
  import crypto from "crypto";

  const router: IRouter = Router();

  const workspaceRoot = process.cwd().endsWith(path.join("artifacts", "api-server"))
    ? path.resolve(process.cwd(), "../..")
    : process.cwd();

  const contentFile = path.resolve(workspaceRoot, "artifacts/api-server/data/content.json");

  function readContent(): unknown {
    try {
      const raw = fs.readFileSync(contentFile, "utf-8");
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  function writeContent(data: unknown): void {
    fs.mkdirSync(path.dirname(contentFile), { recursive: true });
    fs.writeFileSync(contentFile, JSON.stringify(data, null, 2));
  }

  router.get("/content", async (req, res): Promise<void> => {
    const data = readContent();
    res.json(data);
  });

  router.put("/content", async (req, res): Promise<void> => {
    const authHeader = req.headers.authorization;
    const adminPassword = process.env.ADMIN_PASSWORD ?? "productarmor2024";
    const expectedToken = `Bearer ${adminPassword}`;

    if (authHeader !== expectedToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const body = req.body;
    if (!body || typeof body !== "object") {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    writeContent(body);
    req.log.info("Site content updated");
    res.json(body);
  });

  // Document upload for the Downloads section: JSON { data } where data is a
  // base64 string or data URL. PDF only, served from /api/uploads/<file>.
  const uploadsDir = path.resolve(workspaceRoot, "artifacts/api-server/data/uploads");

  router.post("/downloads/upload", async (req, res): Promise<void> => {
    const adminPassword = process.env.ADMIN_PASSWORD ?? "productarmor2024";
    if (req.headers.authorization !== `Bearer ${adminPassword}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { data } = (req.body ?? {}) as { data?: unknown };
    if (typeof data !== "string" || data.length === 0) {
      res.status(400).json({ error: "Missing file data" });
      return;
    }
    const base64 = (data.includes(",") ? data.slice(data.indexOf(",") + 1) : data).replace(/\s/g, "");
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64) || base64.length % 4 !== 0) {
      res.status(400).json({ error: "Invalid base64 data" });
      return;
    }
    const buffer = Buffer.from(base64, "base64");
    if (buffer.length === 0 || buffer.length > 8 * 1024 * 1024) {
      res.status(400).json({ error: "File must be between 1 byte and 8 MB" });
      return;
    }
    if (buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
      res.status(400).json({ error: "Only PDF files are supported" });
      return;
    }
    const name = `doc-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.pdf`;
    fs.mkdirSync(uploadsDir, { recursive: true });
    fs.writeFileSync(path.join(uploadsDir, name), buffer);
    req.log.info({ file: name, bytes: buffer.length }, "Download document uploaded");
    res.status(201).json({ url: `/api/uploads/${name}` });
  });

  export default router;
  
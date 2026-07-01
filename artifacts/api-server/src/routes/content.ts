import { Router, type IRouter } from "express";
  import fs from "fs";
  import path from "path";

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

  export default router;
  
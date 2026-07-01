import { Router, type IRouter } from "express";

  const router: IRouter = Router();

  router.post("/admin/login", async (req, res): Promise<void> => {
    const { password } = req.body ?? {};
    const adminPassword = process.env.ADMIN_PASSWORD ?? "productarmor2024";

    if (!password || password !== adminPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    req.log.info("Admin login successful");
    res.json({ token: adminPassword, message: "Login successful" });
  });

  export default router;
  
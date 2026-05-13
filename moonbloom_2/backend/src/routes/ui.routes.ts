import express, { Request, Response } from "express";

const router = express.Router();

const FRONTEND = process.env.CORS_ORIGIN || "http://localhost:4200";

router.get("/",               (_req, res) => res.redirect(`${FRONTEND}/dashboard`));
router.get("/dashboard",      (_req, res) => res.redirect(`${FRONTEND}/dashboard`));
router.get("/ciclos/nuevo",   (_req, res) => res.redirect(`${FRONTEND}/ciclos/nuevo`));
router.get("/calendario",     (_req, res) => res.redirect(`${FRONTEND}/calendario`));
router.get("/registros/nuevo",(_req, res) => res.redirect(`${FRONTEND}/registros/nuevo`));
router.get("/ciclos/:id/editar", (req: Request, res: Response) =>
  res.redirect(`${FRONTEND}/ciclos/${req.params.id}/editar`)
);

export default router;

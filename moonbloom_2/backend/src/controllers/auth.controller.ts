// ─── Controller de Autenticación ─────────────────────────────────────────
// Endpoints para registro, login y callback de Google OAuth.
// Todos los flujos terminan en un JWT que se envía como cookie httpOnly.

import { Request, Response } from "express";
import User from "../models/user.model";
import { signToken } from "../middleware/auth.middleware";
import { sendWelcomeEmail } from "../services/email.service";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000   // 7 días
};

// ── POST /api/auth/register ──────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("Ya existe una cuenta con ese correo electrónico");
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id.toString());

  // Correo de bienvenida en background — no bloquea la respuesta
  sendWelcomeEmail(user.email, user.name).catch(err =>
    console.error("[auth] Error enviando correo de bienvenida:", err.message)
  );

  res.cookie("token", token, COOKIE_OPTIONS);
  res.status(201).json({ success: true, token, user });
};

// ── POST /api/auth/login ─────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Correo y contraseña son obligatorios");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401);
    throw new Error("Credenciales inválidas");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Credenciales inválidas");
  }

  const token = signToken(user._id.toString());
  res.cookie("token", token, COOKIE_OPTIONS);
  res.json({ success: true, token, user });
};

// ── POST /api/auth/logout ────────────────────────────────────────────────
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie("token");
  res.json({ success: true, message: "Sesión cerrada" });
};

// ── GET /api/auth/me ─────────────────────────────────────────────────────
export const me = (req: Request, res: Response): void => {
  res.json({ success: true, user: req.user });
};

// ── GET /api/auth/google/callback ────────────────────────────────────────
export const googleCallback = (req: Request, res: Response): void => {
  const frontendUrl = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "http://localhost:4200";
  if (!req.user) {
    res.redirect(`${frontendUrl}/login?error=google`);
    return;
  }
  const token = signToken(req.user._id.toString());
  res.cookie("token", token, COOKIE_OPTIONS);
  res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
};

// ── UI: GET /login y GET /registro ───────────────────────────────────────
export const renderLogin = (req: Request, res: Response): void => {
  const error = req.query.error ? `?error=${req.query.error}` : "";
  res.redirect(`${FRONTEND()}/login${error}`);
};

export const renderRegister = (_req: Request, res: Response): void => {
  res.redirect(`${FRONTEND()}/register`);
};

// ── UI: POST /login y POST /registro ─────────────────────────────────────
const FRONTEND = () => process.env.CORS_ORIGIN || "http://localhost:4200";

export const loginUI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      res.redirect(`${FRONTEND()}/login?error=credenciales`);
      return;
    }
    const token = signToken(user._id.toString());
    res.cookie("token", token, COOKIE_OPTIONS);
    res.redirect(`${FRONTEND()}/auth/callback?token=${token}`);
  } catch (err: any) {
    res.redirect(`${FRONTEND()}/login?error=server`);
  }
};

export const registerUI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email: email?.toLowerCase() });
    if (existing) {
      res.redirect(`${FRONTEND()}/register?error=exists`);
      return;
    }
    const user = await User.create({ name, email, password });
    sendWelcomeEmail(user.email, user.name).catch(err =>
      console.error("[auth] Error enviando correo de bienvenida:", err.message)
    );
    const token = signToken(user._id.toString());
    res.cookie("token", token, COOKIE_OPTIONS);
    res.redirect(`${FRONTEND()}/auth/callback?token=${token}`);
  } catch (err: any) {
    res.redirect(`${FRONTEND()}/register?error=server`);
  }
};

export const logoutUI = (_req: Request, res: Response): void => {
  res.clearCookie("token");
  res.redirect(`${FRONTEND()}/login`);
};
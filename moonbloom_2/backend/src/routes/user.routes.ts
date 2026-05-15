import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser, getDashboardData, updateCurrentUserProfile, updateCurrentUserPhoto } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { uploadProfilePhoto } from "../middleware/upload.middleware";

const router = express.Router();

// GET    /api/users       — lista todos los usuarios
// POST   /api/users       — crea un nuevo usuario
router.get("/", getUsers);
router.post("/", createUser);

// GET    /api/users/dashboard — obtiene el resumen para el dashboard
router.get("/dashboard", requireAuth, getDashboardData);

// PATCH  /api/users/profile — actualiza el perfil de la usuaria autenticada
router.patch("/profile", requireAuth, updateCurrentUserProfile);

// PATCH  /api/users/profile/photo — sube o reemplaza la foto de perfil en Cloudinary
router.patch("/profile/photo", requireAuth, uploadProfilePhoto.single("photo"), updateCurrentUserPhoto);

// GET    /api/users/:id   — obtiene un usuario por ID
// PUT    /api/users/:id   — actualiza un usuario por ID
// DELETE /api/users/:id   — elimina un usuario por ID
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;

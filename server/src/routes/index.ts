import express from "express";
import registerRoutes from "./registerRoutes";
import loginRoutes from "./loginRoutes";
import accountRoutes from "./accountRoutes";
import peopleRoutes from "./peopleRoutes";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

// Маршруты, доступные без аутентификации
router.use(registerRoutes);
router.use(loginRoutes);

// Маршруты, требующие аутентификации
router.use(accountRoutes);
router.use(peopleRoutes);

export default router;

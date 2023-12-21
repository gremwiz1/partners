import express from "express";
import { body } from "express-validator";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/profileController";
import upload from "../utils/fileUpload";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

//router.get('/account', getUserProfile);
router.get(
  "/account",
  verifyToken,
  (req, res, next) => {
    next();
  },
  getUserProfile
);

router.put(
  "/account",
  verifyToken,
  upload.single("profilePhoto"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Имя не может быть пустым"),
  body("email").optional().isEmail().withMessage("Неверный формат email"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Пароль должен содержать минимум 6 символов"),
  body("birthdate").optional().isISO8601().withMessage("Неверный формат даты"),
  body("gender")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Пол не может быть пустым"),
  updateUserProfile
);

export default router;

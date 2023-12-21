import express from "express";
import { registerUser } from "../controllers/userController";
import { body } from "express-validator";
import upload from "../utils/fileUpload";

const router = express.Router();

router.post(
  "/register",
  upload.single("profilePhoto"),
  body("name").not().isEmpty().withMessage("Имя не может быть пустым"),
  body("email").isEmail().withMessage("Неверный формат email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль должен содержать минимум 6 символов"),
  body("birthdate").not().isEmpty().withMessage("Неверный формат даты"),
  body("gender").not().isEmpty().withMessage("Пол не может быть пустым"),
  registerUser
);

export default router;

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { loginUser } from '../controllers/authController';

const router = express.Router();

router.post('/login', 
  body('email').isEmail().withMessage('Неверный формат email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    loginUser(req, res);
  }
);

export default router;

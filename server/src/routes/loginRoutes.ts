import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post('/login', 
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Логика авторизации
    res.send('User logged in');
  }
);

export default router;

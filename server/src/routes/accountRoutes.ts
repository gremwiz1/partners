import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.put('/account', 
  body('name').optional().not().isEmpty(),
  body('password').optional().isLength({ min: 6 }),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Логика обновления профиля
    res.send('Profile updated');
  }
);

export default router;

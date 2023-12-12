import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/people', (req: Request, res: Response) => {
  // Логика получения списка пользователей, исключая текущего пользователя
  res.send('List of people');
});

export default router;

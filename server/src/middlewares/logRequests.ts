import { Request, Response, NextFunction } from 'express';

const logRequests = (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  console.log(`[${now.toISOString()}] ${req.method} ${req.url}`);
  next();
};

export default logRequests;

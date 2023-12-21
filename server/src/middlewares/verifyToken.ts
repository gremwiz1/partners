import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Токен не предоставлен" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    );
    // Проверяем, что decoded содержит необходимые поля
    if (typeof decoded === "object" && "userId" in decoded) {
      res.locals.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: "Недействительный токен" });
    }
  } catch (error) {
    res.status(403).json({ message: "Недействительный токен" });
  }
}

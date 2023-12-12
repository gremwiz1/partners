import rateLimit from 'express-rate-limit';

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // ограничение каждого IP до 100 запросов за windowMs
});

import express from 'express';
import { securityMiddleware } from './middlewares/securityMiddleware';
import { rateLimitMiddleware } from './middlewares/rateLimitMiddleware';
import routes from './routes';
import connectDatabase from './database';

const app = express();
const PORT = process.env.PORT || 4000;

connectDatabase();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(securityMiddleware);
app.use(rateLimitMiddleware);

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

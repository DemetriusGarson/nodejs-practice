import express from 'express';
import cors from 'cors';

import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
import studentsRoutes from './routes/studentsRoutes.js';
import { timeLogger } from './middleware/timeLogger.js';
import { errors } from 'celebrate';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Логування
app.use(logger);

// Middleware для парсингу JSON
app.use(express.json());

// Дозволяє запити з будь-яких джерел
app.use(cors());

// Приклад логування часу
app.use(timeLogger);

// Перший маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello world' });
});

// підключаємо групу маршрутів студента
app.use(studentsRoutes);

// обробка 404
app.use(notFoundHandler);

// обробка помилок від celebrate (валідація)
app.use(errors());

// глобальна обробка інших помилок
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

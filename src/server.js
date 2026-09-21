import express from 'express';
import cors from 'cors';

import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
import studentsRoutes from './routes/studentsRoutes.js';
import { timeLogger } from './middleware/timeLogger.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Alice2' },
  { id: 3, name: 'Alice3' },
];

// Логування
app.use(logger);

// Middleware для парсингу JSON
app.use(express.json());

// Дозволяє запити з будь-яких джерел
app.use(cors());

// Приклад логування часу
app.use(timeLogger);

// підключаємо групу маршрутів студента
app.use(studentsRoutes);

// Перший маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello world' });
});

//Второй маршрут
app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Health page',
    status: 'Health OK',
  });
});

//Маршрут по всем юзерам
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

//Динамичиский маршрут юзера по id
app.get('/users/:Id', (req, res) => {
  const userId = Number(req.params.Id);

  // const userId = req.params.Id;
  res.status(200).json(users.find((user) => user.id === userId));
});

// Маршрут для тестовой ошибки
app.get('/test-error', (req, res) => {
  throw new Error('Something went wrong');
});

//! Модуль 2 /////////////////////////////////////////////

// Пример обработки не существующих маршрутов, добавил переменную path для отображения машрута
app.use(notFoundHandler);

// мидлвер для перехоплення помилок
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 3000;

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Alice2' },
  { id: 3, name: 'Alice3' },
];

// Middleware для парсингу JSON
app.use(express.json());

// Дозволяє запити з будь-яких джерел
app.use(cors());

// Приклад логування часу
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// Логування
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss',
        timezone: 'Europe/Kyiv', // строчка для отоброжения актуального времени (не работает?)
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

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

// Пример обработки не существующих маршрутов, добавил переменную path для отображения машрута
app.use((req, res) => {
  const path = req.url;
  res.status(404).json({
    message: '404 page not found',
    path,
  });
});

// мидлвер для перехоплення помилок
app.use((err, req, res, next) => {
  console.error(err);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
    // error: err.message,
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

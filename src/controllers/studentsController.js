import createHttpError from 'http-errors';
import { Student } from '../models/student.js';

export const getStudents = async (req, res) => {
  // Отримуємо пара метри пагінації
  const {
    page = 1,
    perPage = 10,
    gender,
    minAvgMark,
    search,
    // Отримуємо значення параметрів сортування
    // дефолтне сортування по _id
    sortBy = '_id',
    sortOrder = 'asc',
  } = req.query;
  const skip = (page - 1) * perPage;

  // Створюємо базовий запит до колекції, Додаємо критерій пошуку тільки студентів поточного користувача
  const studentsQuery = Student.find({ userId: req.user._id });

  // Будуємо фільтр

  // Пошук по частині імені
  if (search) {
    studentsQuery.where({
      name: { $regex: search, $options: 'i' },
    });
  }

  // Фільтр за статтю
  if (gender) {
    studentsQuery.where('gender').equals(gender);
  }

  // Фільтр за середнім балом
  if (minAvgMark) {
    studentsQuery.where('avgMark').gte(minAvgMark);
  }

  // Виконуємо одразу два запити паралельно
  const [totalItems, students] = await Promise.all([
    studentsQuery.clone().countDocuments(),
    studentsQuery
      .skip(skip)
      .limit(perPage)
      // Додаємо сортування в ланцюжок методів квері
      .sort({
        [sortBy]: sortOrder,
        //! Дополнительная сортировка что бы элементы коллекции с одинаковым значением не возвращались в случайном порядке
        // _id: 'asc',
      }),
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    students,
  });
};

export const getStudentById = async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findOne({
    _id: studentId,
    //Додаємо критерій пошуку тільки студента поточного користувача
    userId: req.user._id,
  });
  if (!student) {
    // throw new Error('Student not found');
    throw createHttpError(404, 'Student not found');
  }
  res.status(200).json(student);
};

export const createStudent = async (req, res) => {
  const student = await Student.create({
    ...req.body,
    // Додаємо властивість userId
    userId: req.user._id,
  });
  res.status(201).json(student);
};

export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findOneAndDelete({
    _id: studentId,
    // Критерій пошуку по userId
    userId: req.user._id,
  });

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }

  res.status(200).json(student);
};

export const updateStudent = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndUpdate(
    // Критерій пошуку по studentId та userId
    { _id: studentId, userId: req.user._id },
    req.body,
    { returnDocument: 'after' }, // повертаємо оновлений документ
  );

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }

  res.status(200).json(student);
};

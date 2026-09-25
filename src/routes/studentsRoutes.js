import { Router } from 'express';

import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from '../controllers/studentsController.js';
import { celebrate } from 'celebrate';
import {
  createStudentSchema,
  getStudentsSchema,
  studentIdParamSchema,
  updateStudentSchema,
} from '../validations/studentsValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// 2. Додаємо middleware до всіх шляхів, що починаються з /students
router.use('/students', authenticate);

router.get('/students', celebrate(getStudentsSchema), getStudents);

router.get(
  '/students/:studentId',
  celebrate(studentIdParamSchema),
  getStudentById,
);

router.post('/students', celebrate(createStudentSchema), createStudent);

router.delete(
  '/students/:studentId',
  celebrate(studentIdParamSchema),
  deleteStudent,
);

router.patch(
  '/students/:studentId',
  celebrate(updateStudentSchema),
  updateStudent,
);

export default router;

import { Router } from 'express';

import {
  getStudentById,
  getStudents,
} from '../controllers/studentsController.js';

const router = Router();

router.get('/students', getStudents);

router.get('/students/:studentID', getStudentById);

export default router;

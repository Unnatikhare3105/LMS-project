//Backend/src/routers/syllabus.routes.ts

import express from 'express';
import * as syllabusController from '../controllers/syllabus.controller';
import { authUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authUser);

// POST /api/syllabus/generate             body: { topic }
router.post('/generate', syllabusController.generateFullController);

// POST /api/syllabus/generate/text        body: { topic }
router.post('/generate/text', syllabusController.generateTextController);

// POST /api/syllabus/generate/video       body: { topic }
router.post('/generate/video', syllabusController.generateVideoController);

// GET  /api/syllabus                      all topics for user
router.get('/', syllabusController.getAllTopicsController);

// GET  /api/syllabus/:syllabusId          get one (syllabusId = UUID)

router.get('/:syllabusId', syllabusController.getSyllabusByIdController);

// PUT  /api/syllabus/:syllabusId          update content
router.put('/:syllabusId', syllabusController.updateSyllabusController);

// DELETE /api/syllabus/:syllabusId        delete
router.delete('/:syllabusId', syllabusController.deleteSyllabusController);

export default router;
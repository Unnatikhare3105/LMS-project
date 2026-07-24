//Backend/src/routers/syllabus.routes.ts

import express from 'express';
import * as syllabusController from '../controllers/syllabus.controller';
import { authUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authUser);

// POST /api/syllabus/generate/text        body: { topic }
// POST /api/syllabus/generate/video       body: { topic }
// GET  /api/syllabus                      all topics for user
// GET  /api/syllabus/:syllabusId          get one (syllabusId = UUID)
// PUT  /api/syllabus/:syllabusId          update content
// DELETE /api/syllabus/:syllabusId        delete

router.post('/generate', syllabusController.generateFullController);

router.post('/generate/text', syllabusController.generateTextController);
router.post('/generate/video', syllabusController.generateVideoController);
router.get('/', syllabusController.getAllTopicsController);
router.get('/:syllabusId', syllabusController.getSyllabusByIdController);
router.put('/:syllabusId', syllabusController.updateSyllabusController);
router.delete('/:syllabusId', syllabusController.deleteSyllabusController);

export default router;
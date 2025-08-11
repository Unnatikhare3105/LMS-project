import express from 'express';
const router = express.Router();
import * as syllabusController from "../controllers/syllabus.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

router.post(
    '/generateText',
    authUser, 
    syllabusController.generateContentAsTextController
);
router.post(
    '/generateVideo',
    authUser, 
    syllabusController.generateContentAsVideoController
);
router.get(
    '/get-all',
     authUser,
      syllabusController.getAllTopicsController
);

router.get(
    '/get-syllabus/:syllabusId',
    authUser,
    syllabusController.getSyllabusByIdController
);

router.put(
    '/update-syllabus/:syllabusId',
    authUser,
    syllabusController.updateSyllabusController
);

router.delete(
    '/delete-syllabus/:syllabusId',
    authUser,
    syllabusController.deleteSyllabusController
);

export default router;
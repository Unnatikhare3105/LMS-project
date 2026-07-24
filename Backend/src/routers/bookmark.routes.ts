//backend/src/routers/bookmark.routes.ts

import express from 'express';
import * as bookmarkController from '../controllers/bookmark.controller';
import { authUser } from '../middlewares/auth.middleware';
const router = express.Router();
router.use(authUser);
router.post('/:syllabusId', bookmarkController.addBookmarkController);
router.get('/', bookmarkController.getBookmarksController);
router.patch('/:bookmarkId/note', bookmarkController.updateBookmarkNoteController);
router.delete('/:bookmarkId', bookmarkController.removeBookmarkController);
export default router;
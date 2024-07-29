import express from 'express'
import { uploadFiles } from '../controllers/file.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/files/upload',upload.array("postImages"),uploadFiles);

export default router;

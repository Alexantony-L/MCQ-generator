import express from 'express';
import multer from 'multer';
import { handleUpload ,getAllVideos, getVideoById} from '../controllers/videoController';
import {authMiddleware} from '../middleware/authMiddleware';
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/upload', upload.single('video'), handleUpload);
router.get('/all', getAllVideos);         
router.get('/:id', getAllVideos);

export default router;

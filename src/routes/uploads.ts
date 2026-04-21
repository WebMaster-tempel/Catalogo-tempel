import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { apiKeyMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Use JPEG, PNG, WEBP, GIF or PDF.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post('/', apiKeyMiddleware, upload.single('file'), (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'NO_FILE', message: 'No file provided' });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    const type = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';

    res.status(201).json({
      data: {
        url,
        filename: req.file.filename,
        original_name: req.file.originalname,
        size: req.file.size,
        type,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;

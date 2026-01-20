import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { id } = req.params; // id_coctel

    if (!id) {
      return cb(new Error('id_coctel es requerido'));
    }

    const uploadPath = path.join(
      process.cwd(),
      'uploads',
      'cocteles',
      id.toString()
    );

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Solo se permiten imágenes'), false);
  }
  cb(null, true);
};

export const uploadCoctelImage = multer({
  storage,
  fileFilter
});

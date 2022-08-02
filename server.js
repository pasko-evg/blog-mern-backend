import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { loginValidation, registerValidation, postCreateValidation } from './validations/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

mongoose
  .connect('mongodb://admin:pass@localhost:27017/blog-mern?authSource=admin')
  .then(() => console.log('DB Ok'))
  .catch((err) => console.log(`Db Error: ${err}`));

const app = express();
const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, 'uploads');
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/upload/${req.file.originalname}`,
  });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts', checkAuth, PostController.remove);
app.patch('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});

import express from 'express';
import userRouter from './userRouter.js';

const apiRouter = express.Router();

apiRouter.use('/test', (req, res) => {
  res.send('Hello from server!');
});

apiRouter.use('/user', userRouter);

export default apiRouter;

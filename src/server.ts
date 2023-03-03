import express from 'express';
import { listRouter, taskRouter, userRouter } from './endpoints';

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(listRouter);
app.listen(3333, () => 'server running on port 3333 🚀');
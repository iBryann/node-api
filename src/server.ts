import { listRouter, taskRouter, userRouter } from './endpoints';
import express from 'express';

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(listRouter);
app.listen(3333, () => 'server running on port 3333 🚀');
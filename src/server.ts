import express from 'express';
import { routes } from './endpoints';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(routes);
app.listen(PORT, () => `Running on port ${PORT} 🚀`);
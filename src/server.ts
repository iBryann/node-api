import express from 'express';
import { routes } from './endpoints';

const app = express();

app.use(express.json());
routes.forEach(route => app.use(route));
app.listen(3333, () => 'server running on port 3333 🚀');
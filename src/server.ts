import express from 'express';
import route from './endpoints';

const app = express();

app.use(express.json());
app.use(route);
app.listen(3333, () => 'server running on port 3333 🚀');
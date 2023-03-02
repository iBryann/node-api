import { PrismaClient } from '@prisma/client';
import express from 'express';
import { Router, Request, Response } from 'express';

const app = express();
const route = Router();

route.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello world!',
  });
});

const prisma = new PrismaClient();

route.get('/user/all', async (req: Request, res: Response) => {
  const users = await prisma.users.findMany();

  res.send(users);
});

route.get('/user/create', async (req: Request, res: Response) => {
  const name = req.query.name as string;
  const response = await prisma.users.create({
    data: {
      name
    }
  });

  res.status(201).send(response);
});

app.use(express.json());
app.use(route);
app.listen(3333, () => 'server running on port 3333 🚀');
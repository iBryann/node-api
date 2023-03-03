import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

router.get('/', (req: Request, res: Response) => {
  res.send(true);
});

router.post('/login', async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(401).send({
      code: 401,
      status: 'Unauthorized',
      message: 'Missing username or password.',
    });
  }

  prisma.user.findUniqueOrThrow({
    where: {
      username_password: {
        username,
        password,
      },
    },
    select: {
      id: true,
      username: true,
    },
  })
    .then(user => res.status(200).send(user))
    .catch(error => res.status(401).send(error));
});

router.post('/user', async (req: Request, res: Response) => {
  try {
    const userSchema = z.object({
      username: z.string().min(6).trim()
        .regex(/\D/, { message: 'Username deve conter apenas letras.' }),
      password: z.string().min(6).trim(),
    });
    const { password, username } = userSchema.parse(req.body);

    if (!username || !password) {
      res.status(403).send({
        code: 403,
        status: 'Forbidden',
        message: 'Missing data to create a user.',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      res.status(500).send({
        code: 500,
        message: 'This user already exists.',
      });
    }

    prisma.user.create({
      data: {
        username,
        password,
        createdAt: new Date(),
      },
    })
      .then(response => res.status(201).send(response))
      .catch(error => res.status(500).send(error));

  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;

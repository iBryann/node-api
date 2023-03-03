import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

router.post('/list', async (req: Request, res: Response) => {
  try {
    const listSchema = z.object({
      userId: z.coerce.number(),
      title: z.string(),
    });
    const { title, userId } = listSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(500).send({
        code: 500,
        message: 'This user does not exist.',
      });
    }

    prisma.list.create({
      data: {
        userId,
        title,
      },
    })
      .then(response => res.status(201).send(response))
      .catch(error => res.status(500).send(error));
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/list', async (req: Request, res: Response) => {
  const userId = Number(req.query.userId) ? Number(req.query.userId) : -1;

  prisma.list.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      Task: {
        select: {
          id: true,
          done: true,
          description: true,
        },
      },
    },
  })
    .then(response => res.status(200).send(response))
    .catch(error => res.status(500).send(error));
});

router.get('/list/one', async (req: Request, res: Response) => {
  const id = Number(req.query.id) ? Number(req.query.id) : -1;

  prisma.list.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      Task: {
        select: {
          id: true,
          done: true,
          description: true,
        },
      },
    },
  })
    .then(response => res.status(200).send(response))
    .catch(error => res.status(500).send(error));
});

router.patch('/list', async (req: Request, res: Response) => {
  const id = Number(req.body.id) ? Number(req.body.id) : -1;
  const title = String(req.body.title);

  prisma.list.update({
    where: {
      id,
    },
    data: {
      title,
    },
    select: {
      id: true,
      title: true,
    },
  })
    .then(response => res.status(201).send(response))
    .catch(error => res.status(500).send(error));
});

router.delete('/list', async (req: Request, res: Response) => {
  const id = Number(req.query.id) ? Number(req.query.id) : -1;

  prisma.list.delete({
    where: {
      id,
    },
  })
    .then(response => res.status(200).send(response))
    .catch(error => res.status(500).send(error));
});

export default router;

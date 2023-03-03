import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

router.post('/task', async (req: Request, res: Response) => {
  try {
    const taskSchema = z.object({
      listId: z.coerce.number(),
      description: z.string(),
    });
    const { description, listId } = taskSchema.parse(req.body);

    const list = await prisma.list.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      res.status(500).send({
        code: 500,
        message: 'This list does not exist.',
      });
    }

    prisma.task.create({
      data: {
        listId,
        description,
      },
    })
      .then(response => res.status(201).send(response))
      .catch(error => res.status(500).send(error));
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/task', async (req: Request, res: Response) => {
  const { body } = req;
  const id = Number(body.id) ? Number(body.id) : -1;
  const description = String(body.description);
  const done = Boolean(body.done);
  const data: Record<string, string | boolean> = {};

  if (description) data.description = description;
  if (done) data.done = done;

  prisma.task.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      done: true,
      description: true,
    },
  })
    .then(response => res.status(201).send(response))
    .catch(error => res.status(500).send(error));
});

router.delete('/task', async (req: Request, res: Response) => {
  const id = Number(req.query.id) ? Number(req.query.id) : -1;

  prisma.task.delete({
    where: {
      id,
    },
  })
    .then(response => res.status(200).send(response))
    .catch(error => res.status(500).send(error));
});

export default router;

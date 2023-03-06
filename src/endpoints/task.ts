import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth, getJwtPayload } from '../auth';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

router.post('/task', auth, async (req: Request, res: Response) => {
  try {
    const { userId } = getJwtPayload(req);
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

    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        List: {
          update: {
            where: {
              id: listId,
            },
            data: {
              Task: {
                create: {
                  description,
                },
              },
            },
          },
        },
      },
      select: {
        List: {
          where: {
            id: listId,
          },
          select: {
            Task: {
              take: -1,
            },
          },
        },
      },
    })
      .then(response => res.status(201).send(response.List[0].Task[0]))
      .catch(error => res.status(500).send(error));
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/task', auth, async (req: Request, res: Response) => {
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

router.delete('/task/:id', auth, async (req: Request, res: Response) => {
  const { userId } = getJwtPayload(req);
  const id = Number(req.params.id) ? Number(req.params.id) : -1;
  const listId = Number(req.query.listId) ? Number(req.query.listId) : -1;

  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      List: {
        update: {
          where: {
            id: listId,
          },
          data: {
            Task: {
              delete: {
                id,
              },
            },
          },
        },
      },
    },
  })
    .then(() => res.status(200).send({ id, message: 'Task removed.' }))
    .catch(error => res.status(500).send(error));
});

export default router;

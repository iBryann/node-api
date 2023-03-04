import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth, getJwtPayload } from '../auth';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

router.post('/list', auth, async (req: Request, res: Response) => {
  try {
    const { id } = getJwtPayload(req);
    const listSchema = z.object({
      title: z.string(),
    });
    const { title } = listSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        id,
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
        userId: id,
        title,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    })
      .then(response => res.status(201).send(response))
      .catch(error => res.status(500).send(error));
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/list', auth, async (req: Request, res: Response) => {
  const { id } = getJwtPayload(req);

  prisma.list.findMany({
    where: {
      userId: id,
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

router.get('/list/:id', auth, async (req: Request, res: Response) => {
  const id = Number(req.params.id) ? Number(req.params.id) : -1;

  prisma.list.findUnique({
    where: {
      id,
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

router.patch('/list', auth, async (req: Request, res: Response) => {
  const { id: userId } = getJwtPayload(req);
  const id = Number(req.body.id) ? Number(req.body.id) : -1;
  const title = String(req.body.title);

  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      List: {
        update: {
          where: {
            id,
          },
          data: {
            title,
          },
        },
      },
    },
    select: {
      List: {
        where: {
          id,
        },
        select: {
          id: true,
          title: true,
        },
      },
    },
  })
    .then(response => res.status(201).send(response.List))
    .catch(error => res.status(500).send(error));
});

router.delete('/list/:id', auth, async (req: Request, res: Response) => {
  const { id: userId } = getJwtPayload(req);
  const id = Number(req.params.id) ? Number(req.params.id) : -1;

  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      List: {
        delete: {
          id,
        },
      },
    },
  })
    .then(() => res.status(200).send({ id, message: 'List removed.' }))
    .catch(error => res.status(500).send(error));
});

export default router;

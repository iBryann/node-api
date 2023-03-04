import { JwtPayload, JwtRequest } from './@types/types';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const SECRET = process.env.SECRET!;

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = String(req.header('Authorization')?.replace('Bearer ', ''));

  if (!token) {
    res.status(401).send({
      code: 401,
      message: 'Please enter a valid token.',
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    (req as unknown as JwtRequest).jwtPayload = decoded as JwtPayload;

    next();
  } catch (error) {
    res.status(401).send(error);
  }
}

export function generateToken(id: number) {
  const token = jwt.sign({ id }, SECRET, { expiresIn: 60 * 60 }); // 60 minutes

  return token;
}

export function getJwtPayload(req: Request) {
  const jwtReq = req as unknown as JwtRequest;

  return jwtReq.jwtPayload;
}

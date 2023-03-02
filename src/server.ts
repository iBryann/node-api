import axios from 'axios';
import express from 'express';
import { Router, Request, Response } from 'express';

const app = express();
const route = Router();

route.get('/', (req: Request, res: Response) => {

  res.json({
    message: 'hello world with Typescript',
  });
});

interface IQuery {
  x: number
  y: number;
}

route.post('/', (req: Request, res: Response) => {
  const { x, y } = req.query as unknown as  IQuery;
  const n1 = x || 1;
  const n2 = y || 1;

  res.status(200).send({ result: n1 * n2 });
});


route.get('/address', (req: Request, res: Response) => {
  const { cep, CEP } = req.query;
  const address = cep || CEP;

  axios(`https://api.postmon.com.br/v1/cep/${address}`)
    .then(({ data }) => res.send(data))
    .catch(err => {
      res.status(500).send({
        code: err.code,
        aaa: err.status,
        message: err.message,
      });
    });
});

app.use(express.json());
app.use(route);
app.listen(3333, () => 'server running on port 3333 🚀');
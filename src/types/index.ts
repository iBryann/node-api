export type User = {
  id: number,
  username: string,
  password: string,
  createdAt: string | Date,
  List: List[],
}

export type List = {
  id: number,
  title: string,
  userId: number,
  createdAt: string | Date,
  Task: Task[],
  User: User,
}

export type Task = {
  id: number,
  done: boolean,
  description: string,
  listId: number,
  createdAt: string | Date,
  list: List,
}
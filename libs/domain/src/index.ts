// @filename: server.ts
import { initTRPC } from '@trpc/server';
import { CreateUserSchema } from '@splashorg/schemas';

const t = initTRPC.create();

interface User {
  id: string;
  name: string;
  lastName: string;
  nickName: string;
}

const userList: User[] = [
  {
    id: '1',
    name: 'Mihael',
    lastName: 'Konjevic',
    nickName: 'retro',
  },
];

export const appRouter = t.router({
  users: t.procedure.query((_req) => {
    return userList;
  }),
  userById: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'string') return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query((req) => {
      const input = req.input;
      const user = userList.find((it) => it.id === input);
      return user;
    }),
  userCreate: t.procedure.input(CreateUserSchema).mutation((req) => {
    const id = `${Math.random()}`;
    const user: User = {
      id,
      name: req.input.name,
      lastName: req.input.lastName,
      nickName: req.input.nickName,
    };
    userList.push(user);
    return user;
  }),
});

export type AppRouter = typeof appRouter;

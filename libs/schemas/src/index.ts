import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  nickName: z.string(),
});

export type CreateUserType = z.infer<typeof CreateUserSchema>;

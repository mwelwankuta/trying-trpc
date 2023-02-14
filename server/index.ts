import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const { router, procedure } = initTRPC.create();

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number().min(1),
});

export type User = z.infer<typeof userSchema>;

const removeUserScheme = z.object({
  id: z.number(),
});

let users: User[] = [];

const appRouter = router({
  sayNames: procedure.query(() => {
    return { users, count: users.length };
  }),
  addName: procedure.input(userSchema).mutation(({ input, ctx }) => {
    users.push({ ...input, id: users.length + 1 });
    console.log(ctx);
    return input;
  }),
  removeName: procedure.input(removeUserScheme).mutation(({ input }) => {
    return users.filter((user) => user.id != input.id);
  }),
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);
app.listen(8080, () => console.log(`listening on port 8080`));

import { rest } from "msw";

export const handlers = [
  rest.post("/v1/users", (req, res, ctx) => {
    return res(ctx.status(201));
  }),
];

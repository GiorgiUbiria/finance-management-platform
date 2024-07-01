import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";

import accounts from "./accounts";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ error: "Internal Error" });
});

const routes = app.route("/accounts", accounts);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;

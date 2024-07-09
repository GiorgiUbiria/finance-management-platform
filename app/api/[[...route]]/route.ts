import { handle } from "hono/vercel";
import { Hono } from "hono";

import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .route("/accounts", accounts)
  .route("/transactions", transactions)
  .route("/categories", categories);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;

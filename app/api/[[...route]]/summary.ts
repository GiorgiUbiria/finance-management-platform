import { Hono } from "hono";
import { z } from "zod";

import { eq, and, inArray, gte, lte, desc, sql, sum } from "drizzle-orm";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { differenceInDays, parse, subDays } from "date-fns";

import { db } from "@/db/drizzle";
import {
  transactions,
  insertTransactionSchema,
  categories,
  accounts,
} from "@/db/schema";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401,
        );
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", defaultTo) : defaultTo;

      const periodLength = differenceInDays(endDate, startDate) + 1;
      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      async function fetchFinancialData(userId: string, startDate: Date, endDate: Date) {
        return await db
          .select({
            income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
            expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
            remaining: sum(transactions.amount).mapWith(Number),
          })
          .from(transactions)
          .innerJoin(
            accounts,
            eq(transactions.accountId, accounts.id)
          )
          .where(
            and(
              accountId ? eq(transactions.id, accounts.id) : undefined,
              eq(accounts.userId, userId),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate),
            )
          );
      }

      const [currentPeriod] = await fetchFinancialData(
        auth.userId,
        startDate,
        endDate
      )

      const [lastPeriod] = await fetchFinancialData(
        auth.userId,
        startDate,
        endDate
      )


      return c.json({
        currentPeriod,
        lastPeriod,
      });
    },
  );

export default app;

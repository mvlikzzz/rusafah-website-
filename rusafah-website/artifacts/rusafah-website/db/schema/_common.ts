import { timestamp } from "drizzle-orm/pg-core";

/** Shared audit-style timestamps. All timestamps are stored in UTC (E-07). */
export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

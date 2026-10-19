import {
  date,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { projects } from "./projects";

/**
 * Every public form writes here. Raw IP addresses are never stored (PDPL, D-11);
 * rate limiting uses a salted hash in rate_limit_buckets instead.
 */
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** contact | interest | visit */
  kind: text("kind").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  message: text("message"),
  appointmentType: text("appointment_type"),
  preferredDate: date("preferred_date"),
  preferredTime: text("preferred_time"),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  sourcePath: text("source_path").notNull(),
  /** new | handled */
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  sourcePath: text("source_path").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
});

/**
 * Transactional outbox. A lead and its notification row are written in one
 * transaction; the worker delivers later. A failed delivery never affects the lead.
 */
export const notificationOutbox = pgTable("notification_outbox", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: text("kind").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  attempts: integer("attempts").notNull().default(0),
  lastError: text("last_error"),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }).notNull().defaultNow(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rateLimitBuckets = pgTable(
  "rate_limit_buckets",
  {
    key: text("key").notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.key, t.windowStart] })],
);

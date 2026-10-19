import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "./_common";

/**
 * CMS users. Passwords are salted scrypt hashes (lib/password.ts) — plaintext
 * is never stored, and this app never writes custom crypto for hashing itself,
 * only calls Node's own scrypt implementation.
 */
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  /** owner | editor — owner can manage admin users, editor manages content only. */
  role: text("role").notNull().default("editor"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
});

/**
 * Append-only record of every CMS mutation: who, what entity, before/after. No
 * row here is ever updated or deleted by application code.
 */
export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => adminUsers.id, { onDelete: "set null" }),
  actorEmail: text("actor_email").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  before: jsonb("before").$type<Record<string, unknown> | null>(),
  after: jsonb("after").$type<Record<string, unknown> | null>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

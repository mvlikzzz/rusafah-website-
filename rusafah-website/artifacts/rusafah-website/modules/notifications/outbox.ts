import "server-only";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { schema } from "@/db/client";

export type Tx = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export type LeadNotification = {
  kind: "lead.created";
  leadId: string;
  leadKind: "contact" | "interest" | "visit";
  fullName: string;
  phone: string;
  email?: string | undefined;
  message?: string | undefined;
  projectName?: string | undefined;
  appointment?: { type: string; date: string; time: string } | undefined;
  sourcePath: string;
};

export type NewsletterNotification = {
  kind: "newsletter.subscribed";
  email: string;
  sourcePath: string;
};

export type CrmLeadSyncNotification = {
  kind: "crm.lead_sync";
  leadId: string;
  leadKind: "contact" | "interest" | "visit";
  fullName: string;
  phone: string;
  email?: string | undefined;
  message?: string | undefined;
  projectName?: string | undefined;
  appointment?: { type: string; date: string; time: string } | undefined;
  sourcePath: string;
  createdAt: string;
};

/** Delivered by email (mailer.ts). */
export type MailNotification = LeadNotification | NewsletterNotification;

export type OutboxPayload = MailNotification | CrmLeadSyncNotification;

/**
 * Writes the notification inside the caller's transaction, so a lead and its
 * alert commit or roll back together (ENGINEERING.md §7, transactional outbox).
 */
export async function enqueueNotification(tx: Tx, payload: OutboxPayload) {
  await tx.insert(schema.notificationOutbox).values({ kind: payload.kind, payload });
}

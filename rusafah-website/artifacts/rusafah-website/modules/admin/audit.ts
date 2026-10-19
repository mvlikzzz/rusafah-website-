import "server-only";
import { schema } from "@/db/client";
import type { Tx } from "@/modules/notifications/outbox";
import type { AdminSessionData } from "@/lib/session";

/**
 * One audit row per mutation: actor, entity, before/after. Written in the same
 * transaction as the mutation it records, so an audit entry never exists without
 * the change it describes (and vice versa).
 */
export async function writeAudit(
  tx: Tx,
  actor: Pick<AdminSessionData, "userId" | "email">,
  entry: {
    action: string;
    entityType: string;
    entityId?: string;
    before: Record<string, unknown> | null;
    after: Record<string, unknown> | null;
  },
) {
  await tx.insert(schema.auditLog).values({
    actorId: actor.userId ?? null,
    actorEmail: actor.email ?? "unknown",
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    before: entry.before,
    after: entry.after,
  });
}

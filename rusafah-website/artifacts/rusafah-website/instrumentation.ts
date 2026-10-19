/**
 * Next.js instrumentation hook: starts the notification worker inside the Node
 * runtime once per server process. Disabled with RUN_NOTIFICATION_WORKER=false
 * when a dedicated worker process is preferred.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.RUN_NOTIFICATION_WORKER === "false") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const { startNotificationWorker } = await import("@/modules/notifications/worker");
  try {
    await startNotificationWorker();
    console.log("[notifications] worker started");
  } catch (err) {
    console.error("[notifications] worker failed to start", err);
  }
}

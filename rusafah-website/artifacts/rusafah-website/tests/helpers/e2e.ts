import type { Page } from "@playwright/test";
import { Pool } from "pg";

/** Waits until React has attached event handlers (see components/shell/hydration-marker.tsx). */
export async function hydrated(page: Page) {
  await page.waitForSelector('html[data-hydrated="true"]', { state: "attached", timeout: 20_000 });
}

export function e2ePool() {
  const url = process.env.DATABASE_URL ?? "postgres://rusafah:rusafah@localhost:5434/rusafah_web";
  return new Pool({ connectionString: url, max: 2 });
}

/** Mailpit HTTP API (docker-compose maps the UI/API to 8026). */
export const MAILPIT_URL = process.env.MAILPIT_URL ?? "http://localhost:8026";

export async function findMailpitMessage(
  subjectPart: string,
  attempts = 20,
): Promise<{ Subject: string } | null> {
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(
      `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(subjectPart)}`,
    );
    if (res.ok) {
      const data = (await res.json()) as { messages?: { Subject: string }[] };
      const hit = data.messages?.find((m) => m.Subject.includes(subjectPart));
      if (hit) return hit;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return null;
}

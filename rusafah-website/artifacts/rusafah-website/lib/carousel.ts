/** The brand slide is `null`; project slides use their persistent slug. */
export function nextSlide(slugs: readonly string[], current: string | null): string | null {
  const order: (string | null)[] = [null, ...slugs];
  return order[(order.indexOf(current) + 1) % order.length] ?? null;
}

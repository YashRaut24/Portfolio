export function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getFlipTransition() {
  return prefersReducedMotion()
    ? { duration: 0.01 }
    : { type: 'spring', stiffness: 260, damping: 22 };
}

export function getSnapBackTransition() {
  return prefersReducedMotion()
    ? { duration: 0.01 }
    : { type: 'spring', stiffness: 300, damping: 26 };
}
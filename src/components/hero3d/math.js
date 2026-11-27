export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export const damp = (current, target, lambda, dt) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

// Shortest signed angle from a to b, in (-PI, PI]
export const angleDiff = (a, b) => {
  const TWO_PI = Math.PI * 2;
  return ((((b - a + Math.PI) % TWO_PI) + TWO_PI) % TWO_PI) - Math.PI;
};

export const dampAngle = (current, target, lambda, dt) =>
  current + angleDiff(current, target) * (1 - Math.exp(-lambda * dt));

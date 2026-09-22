// Time-based filters keep behavior consistent across different inference rates.
export function createGestureFilter(holdMs = 320) {
  let candidate = null, since = 0, last = -Infinity, count = 0;
  return {
    reset() { candidate = null; count = 0; last = -Infinity; },
    update(key, now, current) {
      if (!key || key === current) { this.reset(); return current; }
      if (candidate !== key || now - last > 500) { candidate = key; since = now; count = 0; }
      last = now; count++;
      return count >= 3 && now - since >= holdMs ? key : current;
    }
  };
}
export function createDepthFilter() {
  let samples = [], last = 0;
  return {
    reset() { samples = []; last = 0; },
    update(target, now, current) {
      if (!Number.isFinite(target)) return current;
      if (now - last > 500) samples = [];
      samples.push(Math.max(.45, Math.min(2.2, target)));
      if (samples.length > 5) samples.shift();
      const sorted = [...samples].sort((a,b)=>a-b), median = sorted[Math.floor(sorted.length / 2)];
      const dt = last ? Math.min(100, now-last) : 60; last = now;
      const difference = median-current;
      if (Math.abs(difference) < .025) return current;
      const step = difference * (1-Math.exp(-dt/240));
      const limit = dt * .0012;
      return current + Math.max(-limit, Math.min(limit, step));
    }
  };
}

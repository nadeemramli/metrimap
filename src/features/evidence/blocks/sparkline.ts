// Tiny dependency-free SVG sparkline for the /chart + /snapshot notebook blocks
// (CVS-34 slice 4.3/4.4). Plain SVG string — no React, no charting lib — so it's
// safe inside EditorJS's DOM rendering and in the read-only renderer.

export function sparklineSvg(
  values: number[],
  opts: { width?: number; height?: number; color?: string } = {}
): string {
  const width = opts.width ?? 220;
  const height = opts.height ?? 48;
  const color = opts.color ?? '#6366f1';
  const pad = 4;

  const nums = values.filter((v) => typeof v === 'number' && !isNaN(v));
  if (nums.length === 0) {
    return `<svg width="${width}" height="${height}"></svg>`;
  }
  if (nums.length === 1) nums.push(nums[0]);

  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = max - min || 1;
  const stepX = (width - pad * 2) / (nums.length - 1);

  const pts = nums.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (height - pad * 2) * (1 - (v - min) / span);
    return [x, y] as const;
  });

  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [lx, ly] = pts[pts.length - 1];
  const area = `${pad},${height - pad} ${line} ${width - pad},${height - pad}`;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block">
    <polygon points="${area}" fill="${color}" fill-opacity="0.08" />
    <polyline points="${line}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" />
    <circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="2.6" fill="${color}" />
  </svg>`;
}

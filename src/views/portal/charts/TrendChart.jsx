'use client';
// Zero-dependency inline-SVG charts for the reporting module.
// Specs follow the dataviz method: 2px line, ~10% area wash,
// ring-anchored end dot, hairline gridlines, crosshair + tooltip,
// text in text tokens (never the series color).
import React, { useRef, useState } from 'react';
import { monthLabel } from '../../../portal/portalService';
import styles from './TrendChart.module.css';

const W = 320;
const H = 132;
const PAD = { top: 10, right: 16, bottom: 20, left: 40 };

export function fmtValue(v, decimals = 0) {
  if (v == null || Number.isNaN(v)) return '–';
  if (Math.abs(v) >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (Math.abs(v) >= 10000) return `${(v / 1000).toFixed(1)}K`;
  return v.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Clean rounded axis max: 1/2/5 × 10^n at or above the data max.
function niceMax(max) {
  if (max <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  for (const m of [1, 2, 5, 10]) {
    if (m * pow >= max) return m * pow;
  }
  return 10 * pow;
}

export default function TrendChart({ points, decimals = 0, ariaLabel }) {
  const wrapRef = useRef(null);
  const [hover, setHover] = useState(null);

  if (!points || points.length === 0) return null;

  const values = points.map((p) => p.value ?? 0);
  const yMax = niceMax(Math.max(...values));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const y = (v) => PAD.top + innerH - (v / yMax) * innerH;

  const linePath = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${x(values.length - 1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`;
  const last = values.length - 1;
  const ticks = [0, yMax / 2, yMax];

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestDist = Infinity;
    points.forEach((_, i) => {
      const d = Math.abs(x(i) - px);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    setHover(best);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        role="img"
        aria-label={ariaLabel}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              className={styles.grid}
              x1={PAD.left} x2={W - PAD.right}
              y1={y(t)} y2={y(t)}
            />
            <text className={styles.tick} x={PAD.left - 6} y={y(t) + 3} textAnchor="end">
              {fmtValue(t, t < 10 && decimals ? decimals : 0)}
            </text>
          </g>
        ))}

        <text className={styles.tick} x={x(0)} y={H - 5} textAnchor="start">
          {monthLabel(points[0].period).split(' ')[0]}
        </text>
        <text className={styles.tick} x={x(last)} y={H - 5} textAnchor="end">
          {monthLabel(points[last].period).split(' ')[0]}
        </text>

        <path d={areaPath} className={styles.area} />
        <path d={linePath} className={styles.line} />

        {hover !== null && (
          <g>
            <line
              className={styles.crosshair}
              x1={x(hover)} x2={x(hover)}
              y1={PAD.top} y2={PAD.top + innerH}
            />
            <circle className={styles.hoverDot} cx={x(hover)} cy={y(values[hover])} r="4.5" />
          </g>
        )}

        <circle className={styles.endDot} cx={x(last)} cy={y(values[last])} r="4.5" />
        {hover === null && (
          <text
            className={styles.endLabel}
            x={x(last) - 8}
            y={y(values[last]) - 8}
            textAnchor="end"
          >
            {fmtValue(values[last], decimals)}
          </text>
        )}
      </svg>

      {hover !== null && (
        <div
          className={styles.tooltip}
          style={{ left: `clamp(52px, ${((x(hover) / W) * 100).toFixed(1)}%, calc(100% - 52px))` }}
        >
          <span className={styles.tooltipValue}>{fmtValue(values[hover], decimals)}</span>
          <span className={styles.tooltipLabel}>{monthLabel(points[hover].period)}</span>
        </div>
      )}
    </div>
  );
}

// 12-point-ish sparkline for stat tiles: de-emphasis hue, final
// segment and end dot in the accent.
export function Sparkline({ values }) {
  if (!values || values.length < 2) return null;
  const w = 120;
  const h = 34;
  const pad = 5;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const x = (i) => pad + (i / (values.length - 1)) * (w - pad * 2);
  const y = (v) => pad + (h - pad * 2) * (1 - (v - min) / range);
  const path = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = values.length - 1;
  const lastSeg = `M${x(last - 1).toFixed(1)},${y(values[last - 1]).toFixed(1)} L${x(last).toFixed(1)},${y(values[last]).toFixed(1)}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={styles.spark} aria-hidden="true">
      <path d={path} className={styles.sparkLine} />
      <path d={lastSeg} className={styles.sparkCurrent} />
      <circle cx={x(last)} cy={y(values[last])} r="3.5" className={styles.sparkDot} />
    </svg>
  );
}

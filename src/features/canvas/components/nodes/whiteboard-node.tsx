'use client';

import type { NodeProps } from '@xyflow/react';
import { memo } from 'react';

type WhiteboardShape =
  | 'rect'
  | 'rectangle' // Added for new rectangle tool
  | 'ellipse'
  | 'diamond'
  | 'arrow'
  | 'line'
  | 'text'
  | 'image'
  | 'circle'
  | 'freehand';

export type WhiteboardNodeData = {
  shape: WhiteboardShape;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  imageSrc?: string;
  points?: { x: number; y: number }[]; // freehand
  path?: string; // SVG path for freehand drawing
  width?: number; // For dynamic sizing
  height?: number; // For dynamic sizing
  toBeDeleted?: boolean; // For eraser functionality
};

const DEFAULTS = {
  fill: '#ffffff',
  stroke: '#1f2937',
  strokeWidth: 2,
  fontSize: 16,
};

const WhiteboardNode = memo(({ data, selected }: NodeProps) => {
  const d = (data || {}) as WhiteboardNodeData;
  const fill = d.fill ?? DEFAULTS.fill;
  const stroke = d.stroke ?? DEFAULTS.stroke;
  const strokeWidth = d.strokeWidth ?? DEFAULTS.strokeWidth;
  const fontSize = d.fontSize ?? DEFAULTS.fontSize;

  // Apply eraser effect if marked for deletion
  const isToBeDeleted = d.toBeDeleted;

  // Freehand strokes float on the canvas — no card box/background/border (only
  // a subtle selection outline). Other shapes keep the framed-card look.
  const isFreehand = d.shape === 'freehand';

  // Node size is controlled by style on create; render 100% in an SVG
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
        border: selected
          ? '2px solid #3b82f6'
          : isFreehand
            ? 'none'
            : '1px solid #d1d5db',
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: isFreehand ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
        backgroundColor:
          d.shape === 'image' || isFreehand ? 'transparent' : 'white',
        opacity: isToBeDeleted ? 0.3 : 1,
        filter: isToBeDeleted ? 'grayscale(100%)' : 'none',
        transition: 'opacity 0.2s ease, filter 0.2s ease',
      }}
    >
      {d.shape === 'image' ? (
        <img
          src={d.imageSrc}
          alt="wb"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ) : d.shape === 'text' ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize,
            color: stroke,
            padding: 8,
            textAlign: 'center',
          }}
        >
          {d.text || 'Text'}
        </div>
      ) : (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {(d.shape === 'rect' || d.shape === 'rectangle') && (
            <rect
              x="2"
              y="2"
              width="96"
              height="96"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              rx="6"
            />
          )}
          {d.shape === 'circle' && (
            <circle
              cx="50"
              cy="50"
              r="48"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          )}
          {d.shape === 'ellipse' && (
            <ellipse
              cx="50"
              cy="50"
              rx="48"
              ry="32"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          )}
          {d.shape === 'diamond' && (
            <polygon
              points="50,2 98,50 50,98 2,50"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          )}
          {(d.shape === 'line' || d.shape === 'arrow') &&
            (() => {
              // Endpoints are stored normalized 0..100 by the shape tool so the
              // drawn direction is preserved. Legacy fallback: a fixed diagonal.
              const pts =
                d.points && d.points.length >= 2
                  ? d.points
                  : [
                      { x: 10, y: 70 },
                      { x: 90, y: 30 },
                    ];
              const [p1, p2] = pts;
              const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
              const head = 9;
              const spread = Math.PI / 7;
              const hx1 = p2.x - head * Math.cos(angle - spread);
              const hy1 = p2.y - head * Math.sin(angle - spread);
              const hx2 = p2.x - head * Math.cos(angle + spread);
              const hy2 = p2.y - head * Math.sin(angle + spread);
              return (
                <g stroke={stroke} strokeWidth={strokeWidth} fill="none">
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {d.shape === 'arrow' && (
                    <polygon
                      points={`${p2.x},${p2.y} ${hx1},${hy1} ${hx2},${hy2}`}
                      fill={stroke}
                      stroke="none"
                    />
                  )}
                </g>
              );
            })()}
          {d.shape === 'freehand' && (
            <>
              {/* perfect-freehand stores a closed, variable-width OUTLINE that we
                  fill (the brush colour lives in `stroke`). Legacy points arrays
                  fall back to a constant-width polyline. */}
              {d.path ? (
                <path d={d.path} fill={stroke} stroke="none" />
              ) : (
                d.points &&
                d.points.length > 0 && (
                  <polyline
                    points={d.points.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )
              )}
            </>
          )}
        </svg>
      )}
    </div>
  );
});

WhiteboardNode.displayName = 'WhiteboardNode';
export default WhiteboardNode;

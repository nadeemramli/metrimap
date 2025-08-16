'use client';

import type { NodeProps } from '@xyflow/react';
import { memo } from 'react';

type WhiteboardShape =
  | 'rect'
  | 'rectangle' // Added for new rectangle tool
  | 'ellipse'
  | 'diamond'
  | 'arrow'
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

  // Node size is controlled by style on create; render 100% in an SVG
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
        border: selected ? '2px solid #3b82f6' : '1px solid #d1d5db',
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        backgroundColor: d.shape === 'image' ? 'transparent' : 'white',
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
          {d.shape === 'arrow' && (
            <g fill="none" stroke={stroke} strokeWidth={strokeWidth}>
              <line x1="10" y1="70" x2="90" y2="30" />
              <polygon points="90,30 82,32 85,24" fill={stroke} />
            </g>
          )}
          {d.shape === 'freehand' && (
            <>
              {/* Support both points array and SVG path */}
              {d.path ? (
                <path
                  d={d.path}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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

import { useReactFlow } from '@xyflow/react';
import type { PointerEvent } from 'react';

interface TextToolProps {
  isActive: boolean;
  /** Click to place a text box; opens the inline editor at that spot. */
  onPlace: (p: {
    screenX: number;
    screenY: number;
    flow: { x: number; y: number };
  }) => void;
}

/**
 * Click-to-place overlay for the Text tool. It only captures the placement
 * click and hands the screen + flow position to CanvasPage, which owns the
 * shared inline text editor (also used for double-click re-editing).
 */
export function TextToolComponent({ isActive, onPlace }: TextToolProps) {
  const { screenToFlowPosition } = useReactFlow();
  if (!isActive) return null;

  const onDown = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const flow = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    onPlace({ screenX: e.clientX, screenY: e.clientY, flow });
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'auto',
        cursor: 'text',
        zIndex: 1004,
        touchAction: 'none',
      }}
      onPointerDown={onDown}
    />
  );
}

export default TextToolComponent;

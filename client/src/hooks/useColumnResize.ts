import { useRef, useState, useCallback } from 'react';

export function useColumnResize() {
  const lineRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<{startX: number; startWidth: number; colKey: string} | null>(null);

  const start = useCallback((e: React.MouseEvent, startWidth: number, colKey: string) => {
    setDragging({ startX: e.clientX, startWidth, colKey });
    const line = lineRef.current;
    if (line) {
      line.style.left = `${e.clientX}px`;
      line.classList.add('active');
    }
    document.body.style.userSelect = 'none';
  }, []);

  const move = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    const line = lineRef.current;
    if (line) line.style.left = `${e.clientX}px`;
  }, [dragging]);

  const end = useCallback((onWidth: (colKey: string, width: number) => void) => {
    return (e: MouseEvent) => {
      if (!dragging) return;
      const delta = e.clientX - dragging.startX;
      const newWidth = Math.max(80, dragging.startWidth + delta);
      onWidth(dragging.colKey, newWidth);
      const line = lineRef.current;
      if (line) line.classList.remove('active');
      setDragging(null);
      document.body.style.userSelect = '';
    };
  }, [dragging]);

  return { lineRef, start, move, end, dragging };
}

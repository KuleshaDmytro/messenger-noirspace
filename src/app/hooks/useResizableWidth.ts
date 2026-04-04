import { useCallback, useEffect, useRef, useState } from "react";

type UseResizableSidebarOptions = {
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
  onWidthChange?: (width: number) => void;
};

export function useResizableSidebar({
  minWidth,
  maxWidth,
  defaultWidth,
  onWidthChange,
}: UseResizableSidebarOptions) {
  const [width, setWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const startWidthRef = useRef(defaultWidth);

  useEffect(() => {
    onWidthChange?.(width);
  }, [width, onWidthChange]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);

      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";

      startXRef.current = e.clientX;
      startWidthRef.current = width;
    },
    [width]
  );

    useEffect(() => {
        if (!isDragging) return;

        let frameId: number | null = null;

        const onMouseMove = (moveEvent: MouseEvent) => {
            if (frameId !== null) {
            cancelAnimationFrame(frameId);
            }

            frameId = requestAnimationFrame(() => {
            const delta = moveEvent.clientX - startXRef.current;
            let newWidth = startWidthRef.current + delta;
            newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
            setWidth(newWidth);
            });
        };

        const onMouseUp = () => {
            if (frameId !== null) {
            cancelAnimationFrame(frameId);
            }

            setIsDragging(false);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";

            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            if (frameId !== null) {
            cancelAnimationFrame(frameId);
            }
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isDragging, minWidth, maxWidth]);

  return {
    width,
    handleMouseDown,
    isDragging,
  };
}

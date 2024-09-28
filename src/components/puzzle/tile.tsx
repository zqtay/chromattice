"use client";
import { getMouseTouchPosition } from "@/lib/client/utils";
import { hexToRgb } from "@/lib/common/color";
import { FC, use, useCallback, useEffect, useRef } from "react";
import { highlightOverlappingBox, removeAllBorderHighlight as removeAllHighlight } from "./grid";

type TilePosition = {
  // Position of the tile when drag starts
  x: number;
  y: number;
  // Position of cursor when drag starts relative to the tile
  cursorX: number;
  cursorY: number;
};

const ColorTile: FC<{ color: string; }> = ({ color }) => {
  const ref = useRef<HTMLDivElement>(null);
  const posRef = useRef<TilePosition>({ cursorX: 0, cursorY: 0, x: 0, y: 0 });

  const dragMouseDown = (e: MouseEvent | TouchEvent) => {
    if (!ref.current) return;

    const { x, y } = getMouseTouchPosition(e);
    // Get the mouse cursor offset within element
    posRef.current.cursorX = x - ref.current.offsetLeft;
    posRef.current.cursorY = y - ref.current.offsetTop;
    // Get the current tile position
    posRef.current.x = ref.current.offsetLeft;
    posRef.current.y = ref.current.offsetTop;

    // Register event handlers
    document.onmouseup = document.ontouchend = elementRelease;
    document.onmousemove = document.ontouchmove = elementDrag;
  };

  const elementDrag = (e: MouseEvent | TouchEvent) => {
    if (!ref.current) return;
    const { x, y } = getMouseTouchPosition(e);

    // Calculate element new position, accounting for cursor offset
    posRef.current.x = x - posRef.current.cursorX;
    posRef.current.y = y - posRef.current.cursorY;

    // Set new position in style
    ref.current.style.left = (posRef.current.x) + "px";
    ref.current.style.top = (posRef.current.y) + "px";

    // Highlight the tile when dragged
    const centerX = posRef.current.x + 24;
    const centerY = posRef.current.y + 24;

    // Set all box border to default
    removeAllHighlight();
    // Check and set highlight if it is overlapping a grid box
    highlightOverlappingBox(centerX, centerY);
  };

  const elementRelease =(e: MouseEvent | TouchEvent) => {
    if (!ref.current) return;
    // Calculate element new center position
    const { x, y } = getMouseTouchPosition(e);
    const centerX = x - posRef.current.cursorX + 24;
    const centerY = y - posRef.current.cursorY + 24;

    // Get overlapping box
    const box = document.elementsFromPoint(centerX, centerY).find((el) => el.id.startsWith("box-"));
    if (box) {
      const { x, y } = box.getBoundingClientRect();
      // Snap the element to the box
      ref.current.style.left = x + "px";
      ref.current.style.top = y + "px";
    }

    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  };

  if (ref.current) {
    ref.current.onmousedown = ref.current.ontouchstart = dragMouseDown;
  }

  return <div
    ref={ref}
    className="w-12 h-12 cursor-grab active:cursor-grabbing absolute select-none"
    style={{ backgroundColor: color, color: getTextColorContrast(color) }}
  >
    {color.slice(1)}
  </div>;
};

const getTextColorContrast = (hex: string) => {
  const { red, green, blue } = hexToRgb(hex);
  const brightness = (red + green + blue) / 3;
  return brightness >= 128 ? "black" : "white";
};

export default ColorTile;
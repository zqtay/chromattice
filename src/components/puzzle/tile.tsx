"use client";
import { getMouseTouchPosition } from "@/lib/client/utils";
import { hexToRgb } from "@/lib/common/color";
import { FC, use, useCallback, useEffect, useRef } from "react";

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
    document.onmouseup = document.ontouchend = closeDragElement;
    document.onmousemove = document.ontouchmove = elementDrag;
  };

  const elementDrag = (e: MouseEvent | TouchEvent) => {
    if (!ref.current) return;
    const { x, y } = getMouseTouchPosition(e);

    // console.log("client", x, y);
    // console.log("postRef", posRef.current);
    // console.log("off", ref.current.offsetLeft, ref.current.offsetTop);

    // Calculate element new position, accounting for cursor offset
    posRef.current.x = x - posRef.current.cursorX;
    posRef.current.y = y - posRef.current.cursorY;

    // Set new position in style
    ref.current.style.left = (posRef.current.x) + "px";
    ref.current.style.top = (posRef.current.y) + "px";
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

const closeDragElement = () => {
  /* stop moving when mouse button is released:*/
  document.onmouseup = null;
  document.onmousemove = null;
};

const getTextColorContrast = (hex: string) => {
  const { red, green, blue } = hexToRgb(hex);
  const brightness = (red + green + blue) / 3;
  return brightness >= 128 ? "black" : "white";
};

export default ColorTile;
"use client";
import { getMouseTouchPosition } from "@/lib/client/utils";
import { hexToRgb } from "@/lib/common/color";
import { FC, useEffect, useRef, useState } from "react";
import { highlightOverlappingBox, removeAllBorderHighlight as removeAllHighlight } from "./grid";
import {
  HiLockClosed
} from "react-icons/hi"

type ColorTileProps = {
  id?: string;
  color: string;
  locked?: boolean;
};

type TilePosition = {
  // Position of the tile when drag starts
  x: number;
  y: number;
  // Position of cursor when drag starts relative to the tile
  cursorX: number;
  cursorY: number;
};

const ColorTile: FC<ColorTileProps> = ({ id, color, locked}) => {
  const [tile, setTile] = useState<HTMLDivElement | null>(null);
  const posRef = useRef<TilePosition>({ cursorX: 0, cursorY: 0, x: 0, y: 0 });

  const dragMouseDown = (e: MouseEvent | TouchEvent) => {
    if (!tile) return;

    // Set the tile to absolute position
    tile.style.left = tile.offsetLeft + "px";
    tile.style.top = tile.offsetTop + "px";
    tile.classList.add("absolute");

    const { x, y } = getMouseTouchPosition(e);
    // Get the mouse cursor offset within element
    posRef.current.cursorX = x - tile.offsetLeft;
    posRef.current.cursorY = y - tile.offsetTop;
    // Get the tile position
    posRef.current.x = tile.offsetLeft;
    posRef.current.y = tile.offsetTop;

    // Register event handlers
    document.onmouseup = document.ontouchend = elementRelease;
    document.onmousemove = document.ontouchmove = elementDrag;
  };

  const elementDrag = (e: MouseEvent | TouchEvent) => {
    if (!tile) return;
    const { x, y } = getMouseTouchPosition(e);

    // Calculate element new position, accounting for cursor offset
    posRef.current.x = x - posRef.current.cursorX;
    posRef.current.y = y - posRef.current.cursorY;

    // Set new position in style
    tile.style.left = (posRef.current.x) + "px";
    tile.style.top = (posRef.current.y) + "px";

    // Get the center of the tile, accounting for cursor offset and scroll offset
    const centerX = posRef.current.x + 32 - window.scrollX;
    const centerY = posRef.current.y + 32 - window.scrollY;

    // Set all box border to default
    removeAllHighlight();
    // Check and set highlight if it is overlapping a grid box
    highlightOverlappingBox(centerX, centerY);
  };

  const elementRelease =(e: MouseEvent | TouchEvent) => {
    if (!tile) return;
    // Calculate element new center position
    const { x, y } = getMouseTouchPosition(e);
    // Get the center of the tile, accounting for cursor offset and scroll offset
    const centerX = x - posRef.current.cursorX + 32 - window.scrollX;
    const centerY = y - posRef.current.cursorY + 32 - window.scrollY;

    // Get overlapping box
    const box = document.elementsFromPoint(centerX, centerY).find((el) => el.id.startsWith("box-"));
    if (box) {
      box.appendChild(tile);
    }

    // Reset position and remove highlight
    tile.classList.remove("absolute");
    tile.style.removeProperty("left");
    tile.style.removeProperty("top");
    removeAllHighlight();

    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  };

  useEffect(() => {
    if (tile && !locked) {
      tile.onmousedown = tile.ontouchstart = dragMouseDown;
    }
  }, [tile, locked]);

  return <div
    id={id}
    ref={setTile}
    className="tile"
    style={{ backgroundColor: color, color: getTextColorContrast(color) }}
  >
    {color.slice(1)}
    {locked && <HiLockClosed className="absolute right-1 bottom-1 w-4 h-4" />}
  </div>;
};

const getTextColorContrast = (hex: string) => {
  const { red, green, blue } = hexToRgb(hex);
  const brightness = (red + green + blue) / 3;
  return brightness >= 128 ? "black" : "white";
};

export default ColorTile;
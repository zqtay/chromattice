"use client";
import { hexToRgb } from "@/lib/common/color";
import { FC, use, useCallback, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";

const ColorTile: FC<{ color: string; }> = ({ color }) => {
  const [collected, drag] = useDrag(() => ({
    type: "tile",
    item: { color },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      if (item && dropResult) {
        alert(`You dropped ${item.color}!`)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return <div
    ref={drag as any}
    className="w-12 h-12 cursor-grab active:cursor-grabbing select-none"
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
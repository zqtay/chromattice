"use client";
import { createHexGradient } from "@/lib/common/color";
import { FC, HTMLAttributes } from "react";
import ColorTile from "./tile";
import { useDrop } from "react-dnd";

type ColorGridProps = {
  width: number;
  height: number;
};

const ColorGrid: FC<ColorGridProps> = ({ width, height }) => {
  return <div className="flex flex-col gap-2 w-max">
    {
      Array.from({ length: height }).map((_, y) => (
        <div className="flex gap-2 w-max" key={y}>
          {
            Array.from({ length: width }).map((_, x) => (
              <Box key={x} id={`box-${x},${y}`} />
            ))
          }
        </div>
      ))
    }
  </div>;
};

const Box: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  return <div
    {...props}
    className="w-12 h-12 outline outline-1 outline-gray-200"
  />;
};

export const removeAllBorderHighlight = () => {
  document
    .querySelectorAll(".outline-blue-500[id^='box-']")
    .forEach((el) => {
      el.classList.remove("outline-blue-500");
      el.classList.add("outline-gray-200");
    });
};

export const highlightOverlappingBox = (x: number, y: number) => {
  const box = document.elementsFromPoint(x, y).find((el) => el.id.startsWith("box-"));
  if (!box) return;
  box.classList.remove("outline-gray-200");
  box.classList.add("outline-blue-500");
};

export default ColorGrid;
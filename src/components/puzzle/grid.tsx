"use client";
import { FC, HTMLAttributes } from "react";

type ColorGridProps = {
  width: number;
  height: number;
};

type BoxProps = {
  disabled?: boolean;
} & HTMLAttributes<HTMLDivElement>;

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

const Box: FC<BoxProps> = (props) => {
  return <div
    {...props}
    className={"box" + (props.disabled ? " disabled" : "")}
  />;
};

export const removeAllBorderHighlight = () => {
  document
    .querySelectorAll(".outline-blue-500[id^='box-']")
    .forEach((el) => {
      el.classList.remove("highlight");
    });
};

export const highlightOverlappingBox = (x: number, y: number) => {
  const box = document.elementsFromPoint(x, y).find((el) => el.id.startsWith("box-"));
  if (!box) return;
  box.classList.remove("highlight");
};

export default ColorGrid;
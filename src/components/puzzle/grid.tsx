"use client";
import { createHexGradient } from "@/lib/common/color";
import { FC } from "react";
import ColorTile from "./tile";
import { useDrop } from "react-dnd";

const ColorGrid: FC<{  }> = ({ }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "tile",
    drop: () => ({ name: 'Dustbin' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const isActive = canDrop && isOver
  let backgroundColor = '#222'
  if (isActive) {
    backgroundColor = 'darkgreen'
  } else if (canDrop) {
    backgroundColor = 'darkkhaki'
  }

  return (
    <div ref={drop as any} style={{ backgroundColor }} data-testid="dustbin">
      {isActive ? 'Release to drop' : 'Drag a box here'}
    </div>
  )
};

export default ColorGrid;
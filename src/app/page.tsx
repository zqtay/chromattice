"use client";
import { useEffect, useState } from "react";
import { createHexGradient, generateRandomHexColor, hexToRgb } from "@/lib/common/color";
import ColorTile from "@/components/puzzle/tile";
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import ColorGrid from "@/components/puzzle/grid";
import { isTouchScreenDevice } from "@/lib/client/utils";


const Home = () => {
  const [start, setStart] = useState("ffffff");
  const [end, setEnd] = useState("ffffff");
  const [length, setLength] = useState(2);

  const handleGenerate = () => {
    setStart(generateRandomHexColor());
    setEnd(generateRandomHexColor());
    setLength(Math.floor(Math.random() * 10) + 3);
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div>
      <div className="flex">
        <div className="w-12 h-12" style={{ backgroundColor: start }}>
          Start
        </div>
        <div className="w-12 h-12" style={{ backgroundColor: end }}>
          End
        </div>
        <button onClick={handleGenerate}>
          Generate
        </button>
      </div>
      <div className="flex text-xs">
        {
          createHexGradient(start, end, length).map((color, index) => (
            <ColorTile key={index} color={color} />
          ))
        }
      </div>
      <ColorGrid />
    </div>
  );
};

export default () => {
  const isTouchScreen = isTouchScreenDevice();
  return (
    <DndProvider
      // backend={isTouchScreen ? TouchBackend : HTML5Backend}
      // options={isTouchScreen ? { enableMouseEvents: true } : {}}
      backend={TouchBackend}
      options={{ enableMouseEvents: true, preview: true }}
    >
      <Home />
    </DndProvider>
  );
};
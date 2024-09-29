"use client";
import { useEffect, useState } from "react";
import { createHexGradient, generateRandomHexColor } from "@/lib/common/color";
import ColorTile from "@/components/puzzle/tile";
import ColorGrid from "@/components/puzzle/grid";


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
      <section id="palette" className="flex">
        {
          createHexGradient(start, end, length).map((color, index) => (
            <ColorTile key={index} color={color} />
          ))
        }
      </section>
      <section id="grid" className="w-full h-screen flex items-center justify-center">
        <ColorGrid width={5} height={5} />
      </section>

    </div>
  );
};

export default () => {
  return (
    <Home />
  );
};
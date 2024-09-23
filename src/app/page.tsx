"use client";
import { useEffect, useState } from "react";
import { createHexGradient, generateRandomHexColor, hexToRgb } from "@/lib/common/color";

export default function Home() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [length, setLength] = useState(0);

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
        <div className="w-12 h-12" style={{ backgroundColor: start, color: getTextColorContrast(start) }}>
          Start
        </div>
        <div className="w-12 h-12" style={{ backgroundColor: end, color: getTextColorContrast(end) }}>
          End
        </div>
        <button onClick={handleGenerate}>
          Generate
        </button>
      </div>
      <div className="flex text-xs">
        {
          createHexGradient(start, end, length).map((color, index) => (
            <div key={index} className="w-12 h-12" style={{ backgroundColor: color, color: getTextColorContrast(color) }}>
              {color.slice(1)}
            </div>
          ))
        }
      </div>
    </div>
  );
}

const getTextColorContrast = (hex: string) => {
  const { red, green, blue } = hexToRgb(hex);
  const brightness = (red + green + blue) / 3;
  return brightness >= 128 ? "black" : "white";
};

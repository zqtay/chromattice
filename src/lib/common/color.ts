type RGBObject = {
  red: number;
  green: number;
  blue: number;
};

export const HEX_REGEX = /^[\#]?([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})$/;

export class ColorError extends Error { }

export const hexToRgb = (hex: string): RGBObject => {
  const match = hex.match(HEX_REGEX);
  if (!match) {
    throw new ColorError("Invalid hex color value: " + hex);
  }
  const [_, r, g, b] = match;

  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
  };
};

export const rgbToHex = (rgb: RGBObject) => {
  // Validate values
  validateRgbObject(rgb);
  // Convert to hex in format #RRGGBB
  return "#" +
    rgb.red.toString(16).padStart(2, "0") +
    rgb.green.toString(16).padStart(2, "0") +
    rgb.blue.toString(16).padStart(2, "0");
};

export const createRgbGradient = (start: RGBObject, end: RGBObject, length: number): RGBObject[] => {
  if (length < 2) {
    throw new ColorError("Gradient length must be at least 2");
  }
  const step = {
    red: (end.red - start.red) / length,
    green: (end.green - start.green) / length,
    blue: (end.blue - start.blue) / length,
  };
  return Array.from({ length }, (_, i) => {
    return {
      red: Math.round(start.red + step.red * i),
      green: Math.round(start.green + step.green * i),
      blue: Math.round(start.blue + step.blue * i),
    };
  });
};

export const createHexGradient = (start: string, end: string, length: number): string[] => {
  const startColor = hexToRgb(start);
  const endColor = hexToRgb(end);
  const gradient = createRgbGradient(startColor, endColor, length);
  return gradient.map(rgbToHex);
};

export const validateRgbObject = (rgb: RGBObject) => {
  const entries = Object.entries(rgb);
  const isValid = entries.every(([key, value]) => {
    let result = false;
    result = typeof key === "string";
    result = key === "red" || key === "green" || key === "blue";
    result = typeof value === "number";
    result = value >= 0 || value <= 255;
    return result;
  });
  if (!isValid) {
    throw new ColorError("Invalid rgb value: " + rgb);
  }
};

export const generateRandomHexColor = (): string => {
  const randomColor = Math.floor(Math.random() * 0x1000000).toString(16);
  return "#" + ("000000" + randomColor).slice(-6);
};
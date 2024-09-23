"use client";

export const isTouchScreenDevice = () => {
  try{
      document.createEvent('TouchEvent');
      return true;
  }catch(e){
      return false;
  }
};

export const getMouseTouchPosition = (e: MouseEvent | TouchEvent) => {
  let x, y;
  if (e.type.startsWith("touch")) {
    e = e as TouchEvent;
    const touch = e.touches[0] || e.changedTouches[0];
    x = touch.pageX;
    y = touch.pageY;
  } else if (e.type.startsWith("mouse")) {
    e = e as MouseEvent;
    x = e.clientX;
    y = e.clientY;
  }
  x = x as number;
  y = y as number;
  return { x, y };
};
import { toolbarElements } from "@/constants";
import { Button } from "../ui/button";
import { ActiveElement } from "@/types/types";

import { defaultNavElement } from "@/constants";
import { useEffect, useState } from "react";
import ColorPicker from "./color-picker";

type ToolbarProps = {
  // strokeWidth: number;
  // setStrokeWidth: (strokeWidth: number) => void;
  lastUsedColorRef: React.MutableRefObject<string>;
  strokeWidthRef: React.MutableRefObject<number>;

  activeElement: ActiveElement;
  handleActiveElement: (element: ActiveElement) => void;
};

export default function Toolbar({
  // strokeWidth,
  // setStrokeWidth,
  lastUsedColorRef,
  strokeWidthRef,

  handleActiveElement,
  activeElement,
}: ToolbarProps) {
  const [strokeWidth, setStrokeWidth] = useState(5);

  const [lastUsedColor, setLastUsedColor] = useState("#000000");

  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === activeElement?.value));

  useEffect(() => {
    console.log("active element changed: ", activeElement);
  }, [activeElement]);

  useEffect(() => {
    lastUsedColorRef.current = lastUsedColor;
  }, [lastUsedColor, lastUsedColorRef]);

  useEffect(() => {
    strokeWidthRef.current = strokeWidth;
  }, [strokeWidth, strokeWidthRef]);

  return (
    <div className="fixed bottom-2 transform -translate-x-1/2 left-1/2 bg-gray-50 p-3 shadow-3xl rounded-md">
      <ul className="flex items-center gap-x-2">
        <li>
          <Button
            onClick={() => handleActiveElement(defaultNavElement)}
            size="icon"
            className={`${
              isActive(defaultNavElement.value) ? "bg-primary" : "bg-primary/70"
            }`}
          >
            {defaultNavElement.icon}
          </Button>
        </li>
        {toolbarElements.map((item, index) => (
          <li key={item.name}>
            <Button
              onClick={() => handleActiveElement(item)}
              size="icon"
              className={`${
                isActive(item.value) ? "bg-primary" : "bg-primary/70"
              }`}
            >
              {item.icon}
            </Button>
          </li>
        ))}
        <li>
          <ColorPicker
            lastUsedColor={lastUsedColor}
            setLastUsedColor={setLastUsedColor}
          />
        </li>
      </ul>
    </div>
  );
}

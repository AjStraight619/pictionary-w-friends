import { PaletteIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { HexColorPicker } from "react-colorful";

type ColorPickerProps = {
  lastUsedColor: string;
  setLastUsedColor: (color: string) => void;
};

export default function ColorPicker({
  lastUsedColor,
  setLastUsedColor,
}: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon">
          <PaletteIcon size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <HexColorPicker color={lastUsedColor} onChange={setLastUsedColor} />
      </PopoverContent>
    </Popover>
  );
}

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function StrokeWidthPicker() {
  const handleStrokeWidthChange = () => {};

  return (
    <Popover>
      <PopoverTrigger></PopoverTrigger>
      <PopoverContent className="w-fit"></PopoverContent>
    </Popover>
  );
}

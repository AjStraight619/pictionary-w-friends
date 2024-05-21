import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type MessageInputProps = {
  input: string;
  handleInputChange: (input: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  onClick: (message: string) => void;
};

export default function MessageInput({
  input,
  handleInputChange,
  handleKeyDown,
  onClick,
}: MessageInputProps) {
  return (
    <div className="relative">
      <Input
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <Button
        onClick={() => onClick(input.trim())}
        size="sm"
        variant="ghost"
        className="absolute right-1 top-1/2 transform -translate-y-1/2"
      >
        <SendIcon size={20} />
      </Button>
    </div>
  );
}

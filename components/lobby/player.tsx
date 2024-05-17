import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useEffect } from "react";

type PlayerProps = {
  username: string | undefined;
  color: string;
};

export default function Player({ username, color }: PlayerProps) {
  const [storedColor, setColor, removeColor] = useLocalStorage('playerColor', color)

  useEffect(() => {

    if (!storedColor) {
      setColor(color);
    }
  }, [storedColor, color, setColor]);



  return (
    <li
      className="font-semibold text-sm p-2 rounded-md"
      style={{
        backgroundColor: `${storedColor}20`,
        borderColor: storedColor,
        color: storedColor,
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      {username}
    </li>
  );
}

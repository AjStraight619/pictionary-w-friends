import { useSelf, useStorage } from "@/liveblocks.config";
import { useState } from "react";

export default function LiveCursor() {
  const players = useStorage((root) => root.playerStates);
  const self = useSelf();

  const [count, setCount] = useState("");

  if (!self || !self.id) return null;
  const me = players.get(self.id);

  if (!me) return null;

  return <>{me.isDrawing && <div>{}</div>}</>;
}

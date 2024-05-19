import { useSelf, useStorage } from "@/liveblocks.config";
import { PencilIcon } from "lucide-react";

type PlayerProps = {
  username: string | undefined;
  userId: string | undefined;
  connectionId: number;
  idx: number;
};

export default function Player({
  username,
  userId,
  connectionId,
  idx,
}: PlayerProps) {
  const playerState = useStorage((root) => root.playerStates.get(userId ?? ""));
  const self = useSelf();

  return (
    <li
      className="font-semibold text-sm p-2 rounded-md flex gap-x-2 min-w-[7rem]"
      style={{
        backgroundColor: `${playerState?.color}20`,
        borderColor: playerState?.color ?? "",

        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      <span
        style={{
          color: playerState?.color ?? "",
        }}
        className="font-semibold"
      >
        {username}
      </span>
      <span>{playerState?.score}</span>
      {playerState?.isDrawing && (
        <span className="ml-auto">
          <PencilIcon fill="orange" size={20} />
        </span>
      )}
    </li>
  );
}

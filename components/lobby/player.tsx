import { useSelf, useStorage } from "@/liveblocks.config";

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
      className="font-semibold text-sm p-2 rounded-md"
      style={{
        backgroundColor: `${playerState?.color}20`,
        borderColor: playerState?.color ?? "",
        color: playerState?.color ?? "",
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      <span>{username}</span>
      <span className="ml-1">{idx}</span>
      {self && <span className="ml-1">You</span>}
    </li>
  );
}

import { Live } from "@/components/index";
import { Room } from "../room";
import { Liveblocks } from "@liveblocks/node";

export type RoomPageProps = {
  params: {
    roomId: string;
  };
};

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export default async function RoomPage({ params: { roomId } }: RoomPageProps) {
  return (
    <Room roomId={roomId}>
      <Live />
    </Room>
  );
}

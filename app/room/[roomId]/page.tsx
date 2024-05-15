import Live from "@/components";
import { Room } from "../room";

export type RoomPageProps = {
  params: {
    roomId: string;
  };
};

export default function RoomPage({ params: { roomId } }: RoomPageProps) {
  return (
    <Room roomId={roomId}>
      <Live />
    </Room>
  );
}

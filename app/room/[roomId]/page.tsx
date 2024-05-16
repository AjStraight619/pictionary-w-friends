import { Live } from "@/components/index";
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

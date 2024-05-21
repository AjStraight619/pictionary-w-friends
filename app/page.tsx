import { getPlayerRooms } from "@/actions/getData";
import Topnav from "@/components/landing-page/topnav";

import { Liveblocks, RoomInfo } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

// ! Later on I will implement a cron job. This will obviously not scale well, however for testing purposes I want to remove the rooms in which I am testing in

export default async function Home() {
  const { data: rooms } = await liveblocks.getRooms();

  const filterOldRooms = (rooms: RoomInfo[]) => {
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    return rooms
      .filter((room) => {
        if (!room.lastConnectionAt) {
          return false;
        }
        const lastConnectionTime = new Date(room.lastConnectionAt).getTime();
        return now - lastConnectionTime > THREE_DAYS_MS;
      })
      .map((room) => room.id);
  };

  const deleteOldRooms = async (rooms: RoomInfo[]) => {
    const oldRoomIds = filterOldRooms(rooms);

    for (const roomId of oldRoomIds) {
      try {
        await liveblocks.deleteRoom(roomId);
        console.log(`Room ${roomId} deleted successfully`);
      } catch (error) {
        console.error(`Failed to delete room ${roomId}:`, error);
      }
    }
  };

  deleteOldRooms(rooms);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Topnav />
    </main>
  );
}

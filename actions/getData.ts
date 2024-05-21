"server only";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import "server-only";

export async function getPlayerRooms() {
  const user = await currentUser();

  if (!user || !user.id) {
    return {
      success: false,
      error: {
        message: "User does not have a valid session",
      },
      data: null,
    };
  }

  const playerRooms = await db.room.findMany({
    where: {
      playerId: user.id,
    },
  });

  return {
    success: true,
    error: null,
    data: {
      playerRooms: playerRooms,
    },
  };
}

import { db } from "@/lib/db";
import { CreateRoomSchema } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

export async function createRoom(values: z.infer<typeof CreateRoomSchema>) {
  const user = await currentUser();
  const validatedValues = CreateRoomSchema.safeParse(values);
  if (!user || !user.id) {
    return {
      error: "User could not be identified",
      success: false,
    };
  }

  if (!validatedValues.success) {
    return {
      success: false,
      error: getErrorMessage(validatedValues.error),
    };
  }

  const {
    data: { name, isOpen, maxPlayers },
  } = validatedValues;

  // const newRoom = await db.room.create({
  //     data: {

  //     }
  // })
}

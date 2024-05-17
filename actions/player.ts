"use server";

import { db } from "@/lib/db";
import { getErrorMessage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { CreatePlayerSchema } from "@/lib/schemas";

export async function createPlayer(values: z.infer<typeof CreatePlayerSchema>) {
  const validatedValues = CreatePlayerSchema.safeParse(values);

  if (!validatedValues.success) {
    return {
      success: false,
      error: getErrorMessage(validatedValues.error),
    };
  }

  const { username } = validatedValues.data;

  const currUser = await currentUser();
  if (!currUser || !currUser.id || !currUser.firstName) {
    return {
      success: false,
      error: "No valid user id or missing first name",
    };
  }

  try {
    const newPlayer = await db.player.create({
      data: {
        id: currUser.id,
        name: currUser.firstName,
        username: username,
        isProfileComplete: false,
      },
    });
    if (!newPlayer) {
      return {
        success: false,
        error: "Failed to create player in database",
      };
    }
  } catch (e) {
    const error = getErrorMessage(e);
    return {
      sucess: false,
      error,
    };
  }
}

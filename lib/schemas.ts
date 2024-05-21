import { z } from "zod";

export const CreatePlayerSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters long",
    })
    .max(12, {
      message: "Username cannot exceed 12 characters",
    }),
});

export const CreateRoomSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Room name must be at least two characters",
    })
    .max(12, {
      message: "Room name can not be ",
    }),
  isOpen: z.boolean(),

  maxPlayers: z
    .number()
    .min(2, {
      message: "Must be at least two players",
    })
    .max(8, {
      message: "Maximum of 8 players allowed per room",
    }),
});

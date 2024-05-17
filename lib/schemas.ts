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

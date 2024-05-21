"use client";

import { getPlayerRooms } from "@/actions/getData";
import { Prisma } from "@prisma/client";

type JoinOldRoom = {
  userRooms: Prisma.PromiseReturnType<typeof getPlayerRooms>;
};

export default function JoinOldRoom({ userRooms }: JoinOldRoom) {
  return <div></div>;
}

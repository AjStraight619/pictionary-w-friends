"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { MessageType, UserState } from "@/types/types";

type RoomProps = {
  children: ReactNode;
  roomId: string;
};

export function Room({ children, roomId }: RoomProps) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        isDrawing: false,
        hasHadTurn: false,
        color: null,
        penColor: null,
      }}
      initialStorage={{
        canvasObjects: new LiveMap(),
        scores: new LiveMap(),
        round: new LiveObject(),
        messages: new LiveList<LiveObject<MessageType>>(),
        playerStates: new LiveMap<string, LiveObject<UserState>>(),
      }}
    >
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

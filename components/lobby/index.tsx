"use client";
import {
  Presence,
  UserMeta,
  useMutation,
  useOthers,
  useSelf,
  useStorage,
} from "@/liveblocks.config";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useMemo } from "react";
import { LiveObject, User } from "@liveblocks/client";
import { COLORS } from "@/constants";
import Player from "./player";
import { UserState } from "@/types/types";

export type Player = User<Presence, UserMeta>;
const assignUniqueColor = (assignedColors: Set<string>) => {
  for (let color of COLORS) {
    if (!assignedColors.has(color)) {
      assignedColors.add(color);
      return color;
    }
  }
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

export default function Lobby() {
  const self = useSelf();
  const others = useOthers();

  const playerStates = useStorage((root) => root.playerStates);

  const assignPlayerState = useMutation(({ storage, self }) => {
    const playerStates = storage.get("playerStates");

    if (!self || !self.id) return;

    if (!playerStates.get(self.id)) {
      const assignedColors = new Set<string>();
      const playerStatesImmutable = playerStates.toImmutable();

      Array.from(playerStatesImmutable.values()).forEach((state) => {
        assignedColors.add(state.color);
      });

      const color = assignUniqueColor(assignedColors);
      const initialState = new LiveObject<UserState>({
        id: self.id,
        isDrawing: false,
        score: 0,
        color: color,
        timeJoined: Date.now(),
      });
      playerStates.set(self.id, initialState);
    }
  }, []);

  useEffect(() => {
    if (self) {
      assignPlayerState();
    }
  }, [self, assignPlayerState]);

  const allPlayers: Player[] = useMemo(() => {
    const playerMap = new Map();
    if (self) playerMap.set(self.id, self);
    others.forEach((player) => playerMap.set(player.id, player));
    return Array.from(playerMap.values());
  }, [others, self]);

  return (
    <Card className="select-none self-start">
      <CardHeader>
        <CardTitle>Players</CardTitle>
      </CardHeader>
      <CardContent>
        {allPlayers && (
          <ul className="space-y-1">
            {allPlayers.map((player, idx) => (
              <Player
                key={player.id}
                userId={player.id}
                username={player.info?.username}
                connectionId={player.connectionId}
                idx={idx}
              />
            ))}
            <>
              {testUsers.map((user, idx) => (
                <li key={idx}>{user.name}</li>
              ))}
            </>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

const testUsers = [
  {
    name: "John",
  },
  {
    name: "John",
  },
  {
    name: "John",
  },

  {
    name: "John",
  },
  {
    name: "John",
  },
  {
    name: "John",
  },
];

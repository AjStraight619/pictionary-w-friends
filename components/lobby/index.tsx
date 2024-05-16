"use client";
import { Presence, UserMeta, useOthers, useSelf } from "@/liveblocks.config";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useMemo } from "react";
import { User } from "@liveblocks/client";
import { COLORS } from "@/constants";
import Player from "./player";

export type Player = User<Presence, UserMeta>;

export default function Lobby() {
  const self = useSelf();
  const others = useOthers();

  const allPlayers: Player[] = useMemo(() => {
    const playerMap = new Map();
    if (self) playerMap.set(self.id, self);
    others.forEach((player) => playerMap.set(player.id, player));
    return Array.from(playerMap.values());
  }, [others, self]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>
      </CardHeader>
      <CardContent>
        {allPlayers && (
          <ul className="space-y-1">
            {allPlayers.map((player) => (
              <Player
                key={player.id}
                color={COLORS[player.connectionId % COLORS.length]}
                username={player.info?.username}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

// const assignUniqueColor = (assignedColors: Set<string>) => {
//   for (let color of COLORS) {
//     if (!assignedColors.has(color)) {
//       assignedColors.add(color);
//       return color;
//     }
//   }
//   // Fallback if all colors are used, should not happen in normal circumstances
//   return COLORS[Math.floor(Math.random() * COLORS.length)];
// };

// const useAssignPlayerColor = () => {
//   return useMutation(({ storage, self, setMyPresence }) => {
//     const playerColors = storage.get("playerColors");
//     if (!playerColors) return;
//     if (!self || !self.id) return;
//     let color = playerColors.get(self.id);
//     if (!color) {
//       const assignedColors = new Set(playerColors.values());
//       color = assignUniqueColor(assignedColors);
//       playerColors.set(self.id, color);
//     }

//     setMyPresence({ color: color });
//   }, []);
// };

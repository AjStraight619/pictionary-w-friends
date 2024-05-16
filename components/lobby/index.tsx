"use client";
import {
  Presence,
  UserMeta,
  useMutation,
  useMyPresence,
  useOthers,
  useSelf,
} from "@/liveblocks.config";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useMemo } from "react";
import { User } from "@liveblocks/client";
import { COLORS } from "@/constants";

export default function Lobby() {
  const self = useSelf();
  const others = useOthers();
  // const assignPlayerColor = useAssignPlayerColor();

  // // Assign color when component mounts
  // useEffect(() => {
  //   if (self) {
  //     assignPlayerColor();
  //   }
  // }, [self, assignPlayerColor]);

  const allPlayers = useMemo(() => {
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
              <li
                className={`font-semibold text-sm p-2 rounded-md`}
                key={player.connectionId}
                style={{
                  backgroundColor: `${player.presence.color}20`,
                  borderColor: player.presence.color,
                  color: player.presence.color,
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
              >
                {player.info?.username}
              </li>
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

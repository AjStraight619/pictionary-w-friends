"use client";
import Lobby from "@/components/lobby/index";
import Chat from "./chat";
import Canvas from "./canvas/canvas";
import Words from "./words";
import { useMutation, useSelf, useStorage } from "@/liveblocks.config";
import useInterval from "@/hooks/useInterval";
import { useState } from "react";
import { Button } from "./ui/button";

export const Live = () => {
  const timerStarted = useStorage((root) => root.timer.timeStarted);
  return (
    <div className="h-screen relative overflow-hidden">
      {/* <GameTimer /> */}

      <div className="flex items-center gap-x-2 p-2 h-full">
        {/* <Words /> */}
        {/* <Lobby /> */}
        <Canvas />
        {/* <Chat /> */}
      </div>
    </div>
  );
};

function GameTimer() {
  const myId = useSelf((me) => me.id);
  const playerStates = useStorage((root) => root.playerStates);

  const timeInfo = useStorage((root) => ({
    time: root.timer.time,
    timerStarted: root.timer.timeStarted,
  }));

  const leader = Array.from(playerStates.values()).find((p) => p.isLeader);
  console.log("leader: ", leader);
  useInterval(() => {
    if (timeInfo.timerStarted) {
      decrementTimer();
    }
  }, 1000);

  const startTimer = useMutation(({ storage }) => {
    storage.get("timer").set("timeStarted", true);
    storage.get("timer").set("time", 60);
  }, []);

  const decrementTimer = useMutation(({ storage }) => {
    const currentTime = storage.get("timer").get("time");
    if (currentTime > 0) {
      storage.get("timer").set("time", currentTime - 1);
    } else {
      stopTimer();
    }
  }, []);

  const stopTimer = useMutation(({ storage }) => {
    storage.get("timer").set("time", 60);
    storage.get("timer").set("timeStarted", false);
  }, []);

  return (
    <div className="absolute bottom-2 left-2 flex items-center gap-x-2">
      {leader?.id === myId && (
        <>
          <span>{timeInfo.time}</span>
          <Button onClick={startTimer}>Start Timer</Button>
        </>
      )}
    </div>
  );
}

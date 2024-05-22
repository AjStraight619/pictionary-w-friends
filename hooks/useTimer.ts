import { useMutation, useSelf, useStorage } from "@/liveblocks.config";
import useInterval from "./useInterval";

export function useTimer(timerId: string) {
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
}

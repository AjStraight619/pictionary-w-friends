import { useMutation, useStorage } from "@/liveblocks.config";
import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import Lobby from ".";
import { WordDifficulty } from "@/types/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PreGameLobby() {
  const isGameStarted = useStorage((root) => root.gameState.isGameStarted);
  const [timePerRound, setTimePerRound] = useState(60);
  const [maxRounds, setMaxRounds] = useState(5);
  const [wordDifficulty, setWordDifficulty] = useState<WordDifficulty>("easy");

  const handleGameStart = useMutation(({ storage }) => {}, []);

  return (
    <Dialog open={!isGameStarted} onOpenChange={handleGameStart}>
      <DialogContent>
        <Lobby />
        <GameOptions
          setTimePerRound={setTimePerRound}
          setMaxRounds={setMaxRounds}
          setWordDifficulty={setWordDifficulty}
        />
      </DialogContent>
    </Dialog>
  );
}

// ? Could use useMutation but not sure if making repeated calls to storage is worth it, this is kind of duplicating but will leave it like this for now

type GameOptionsProps = {
  setTimePerRound: (time: number) => void;
  setWordDifficulty: (difficulty: WordDifficulty) => void;
  setMaxRounds: (rounds: number) => void;
};

function GameOptions({
  setTimePerRound,
  setWordDifficulty,
  setMaxRounds,
}: GameOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      <Select onValueChange={(value) => setTimePerRound(Number(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="80" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="60">60</SelectItem>
          <SelectItem value="80">80</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => setWordDifficulty(value as WordDifficulty)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="easy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => setMaxRounds(Number(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="8">8</SelectItem>
          <SelectItem value="11">11</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

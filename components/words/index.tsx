"use client";

import { useMutation, useSelf, useStorage } from "@/liveblocks.config";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import useInterval from "@/hooks/useInterval";

export default function Words() {
  const currentWord = useStorage((root) => root.round.word);
  const playerStates = useStorage((root) => root.playerStates);
  const self = useSelf();

  const playerStateValues = playerStates.values();
  console.log("player state values: ", playerStateValues);

  const [testWord, setTestWord] = useState("Test Word");
  const [timer, setTimer] = useState(80);
  const [revealedIndices, setRevealedIndices] = useState(
    Array.from({ length: testWord.length }).fill(false)
  );

  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const playerStateValues = playerStates.values();
    const playerStatesArray = Array.from(playerStateValues);
    const playerIsDrawing = playerStatesArray.some((p) => p.isDrawing);
    setIsDrawing(playerIsDrawing);
  }, [playerStates]);

  useInterval(() => {
    // Logic to reveal a letter every 10 seconds
    revealNextLetter();
  }, 10000); // Every 10 seconds reveal a letter

  const revealNextLetter = () => {
    // Find the next unrevealed index and reveal it
    const nextIndex = revealedIndices.findIndex((revealed) => !revealed);
    if (nextIndex !== -1) {
      setRevealedIndices((prev) => {
        const newRevealed = [...prev];
        newRevealed[nextIndex] = true;
        return newRevealed;
      });
    }
  };

  const renderWord = () => {
    return (
      <div className="flex flex-row items-center justify-center">
        {testWord.split("").map((char, idx) => (
          <div
            className="ml-1 flex flex-col items-center gap-y-1 justify-center"
            key={idx}
            style={{ height: "2rem", width: "1rem" }}
          >
            <span style={{ lineHeight: 0 }}>
              {char !== " " ? char.toUpperCase() : <span>&nbsp;</span>}
            </span>
            {char !== " " && <span>__</span>}
          </div>
        ))}
        {/* <Button className="ml-2">Reveal Indices</Button> */}
      </div>
    );
  };

  const renderRevealedWord = () => {
    return (
      <div className="flex flex-row items-center justify-center">
        {testWord.split("").map((char, idx) => (
          <div
            className="ml-1 flex flex-col items-center gap-y-1 justify-center"
            key={idx}
            style={{ height: "2rem", width: "1rem" }}
          >
            <span style={{ lineHeight: 0 }}>
              {revealedIndices[idx] || char === " " ? (
                char.toUpperCase()
              ) : (
                <span>&nbsp;</span>
              )}
            </span>
            {char !== " " && <span>__</span>}
          </div>
        ))}
        {/* <Button className="ml-2">Reveal Indices</Button> */}
      </div>
    );
  };

  const handlePlayerDrawingChange = useMutation(({ storage, self }) => {
    const playerStates = storage.get("playerStates");
    if (!self || !self.id) return;
    const userState = playerStates.get(self.id);
    const isDrawing = userState?.get("isDrawing");
    if (isDrawing) {
      userState?.set("isDrawing", false);
    } else {
      userState?.set("isDrawing", true);
    }
  }, []);

  return (
    <div className="flex items-center gap-x-2">
      <div className="-translate-x-1/2 left-1/2 fixed top-4 p-4 bg-background shadow-2xl rounded-md h-16">
        <div className="flex flex-col leading-3 items-center h-full">
          {isDrawing ? renderWord() : renderRevealedWord()}
          <Button onClick={handlePlayerDrawingChange}>Change isDrawing</Button>
        </div>
      </div>
    </div>
  );
}

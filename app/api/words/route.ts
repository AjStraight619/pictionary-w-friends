import { wordData } from "@/data/words";
import { WordDifficulty } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let mode = req.nextUrl.searchParams.get("mode") as WordDifficulty;

  const validModes: WordDifficulty[] = ["easy", "medium", "hard"];

  if (!validModes.includes(mode)) {
    mode = "easy";
  }

  const words = wordData[mode];
  const randomIndex = Math.floor(Math.random() * words.length);
  const randomWord = words[randomIndex];

  return NextResponse.json({ word: randomWord });
}

"use client";
import { useMutation, useStorage } from "@/liveblocks.config";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { LiveObject } from "@liveblocks/client";
import { Message } from "@/types/types";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

const containerVariants = {
  hidden: {
    y: -10,
  },
  show: {
    y: 0,
    transition: {
      staggerChildren: 0.1,
      type: "spring",
    },
  },
};

const messageVariants = {
  hidden: { opacity: 0, x: "-100%" },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

type UserGuessType = {
  messageId: string;
  isClose: boolean;
  isCorrect: boolean;
};

export default function Chat() {
  const messages = useStorage((root) => root.messages);
  const currentWord = useStorage((root) => root.round.word);
  const [input, setInput] = useState("");

  const [userGuess, setUserGuess] = useState<UserGuessType>({
    messageId: "",
    isClose: false,
    isCorrect: false,
  });

  const [testWord, setTestWord] = useState("TEST WORD");

  // const [isUserCorrect, setIsUserCorrect] = useState(false);
  // const [isUserClose, setIsUserClose] = useState(false);

  const bottomOfMessagesRef = useRef<HTMLDivElement>(null);

  // const checkGuess = (message: string) => {
  //   if ("TEST WORD" === message.toUpperCase()) {
  //     // setIsUserCorrect(true);
  //     return;
  //   } else {
  //     let correctChars = 0;
  //     testWord.split("");
  //     const charLength = testWord.length;
  //     const closeGuess = charLength - 2;
  //     message.split("").forEach((char, idx) => {
  //       if (char.toUpperCase() === testWord[idx]) {
  //         correctChars++;
  //       }
  //     });

  //     if (correctChars >= closeGuess) {
  //       // setIsUserClose(true);
  //     }
  //   }
  // };

  const isCorrect = (message: string) => {
    return message.toUpperCase() === testWord;
  };

  useEffect(() => {
    if (bottomOfMessagesRef.current) {
      bottomOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const clearMessages = useMutation(({ storage }) => {
    storage.get("messages").clear();
  }, []);

  const sendMessage = useMutation(({ storage, self }, message: string) => {
    if (!self || !self.id || !self?.info?.username) return;

    const messages = storage.get("messages");

    const isCorrectGuess = isCorrect(message);
    const isCloseGuess =
      !isCorrectGuess && testWord.startsWith(message.toUpperCase());

    const newMessage = new LiveObject<Message>({
      id: nanoid(),
      userId: self.id,
      content: isCorrectGuess
        ? `${self.info.username} guessed the word!!`
        : isCloseGuess
        ? `${self.info.username} is close!!`
        : message,
      username: self.info?.username,
      isCorrect: isCorrectGuess,
      isClose: isCloseGuess,
    });

    messages.push(newMessage);

    setUserGuess({
      messageId: newMessage.toObject().id,
      isClose: isCloseGuess,
      isCorrect: isCorrectGuess,
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <Card className="max-w-[15rem] h-[20rem] flex flex-1 flex-col">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <Button onClick={clearMessages}>Clear</Button>
      </CardHeader>
      <ScrollArea>
        <CardContent className="w-full h-full flex-1">
          <motion.ul
            animate="show"
            initial="hidden"
            variants={containerVariants}
            className="mt-auto px-2"
          >
            {messages.map((msg) => (
              <motion.li
                className="text-wrap break-words"
                key={msg.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
              >
                <span className="font-bold">{msg.username}:</span>{" "}
                <span
                  className={`text-wrap break-words ${
                    userGuess.isCorrect && userGuess.messageId === msg.id
                      ? "text-green-500"
                      : userGuess.isClose && userGuess.messageId === msg.id
                      ? "text-yellow-500"
                      : ""
                  }
            `}
                >
                  {msg.content}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          <div ref={bottomOfMessagesRef} />
        </CardContent>
      </ScrollArea>

      <CardFooter className="mt-auto">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </CardFooter>
    </Card>
  );
}

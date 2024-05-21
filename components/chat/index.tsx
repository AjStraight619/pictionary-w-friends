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
import { useCallback, useEffect, useRef, useState } from "react";
import { LiveObject } from "@liveblocks/client";
import { MessageType } from "@/types/types";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { IndividualMessage } from "./message";
import { SendIcon } from "lucide-react";
import MessageInput from "./message-input";

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

export type UserGuessType = {
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

  const bottomOfMessagesRef = useRef<HTMLDivElement>(null);

  const isCorrect = (message: string) => {
    return message.toUpperCase() === testWord;
  };

  const sliceEndOfWord = () => {
    const slicedWord = testWord
      .split("")
      .slice(0, testWord.length - 2)
      .join("");
    console.log(slicedWord);
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
      !isCorrectGuess &&
      (() => {
        const upperMessage = message.toUpperCase();
        const upperTestWord = testWord.toUpperCase();

        // Ensure the test word is long enough
        if (upperTestWord.length <= 2) {
          return false;
        }

        const partialTestWord = upperTestWord.slice(
          0,
          upperTestWord.length - 2
        );
        return upperMessage.includes(partialTestWord);
      })();

    const newMessage = new LiveObject<MessageType>({
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
    setInput("");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Enter") return;
      sendMessage(input.trim());
      setInput("");
    },
    [input, sendMessage]
  );

  const handleInputChange = useCallback((input: string) => {
    setInput(input);
  }, []);

  return (
    <Card className="w-[14rem] h-[calc(50%)] flex flex-col">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <Button onClick={clearMessages}>Clear</Button>
        <Button onClick={sliceEndOfWord}>Slice</Button>
      </CardHeader>
      <ScrollArea>
        <CardContent className="">
          <motion.ul
            animate="show"
            initial="hidden"
            variants={containerVariants}
            className="px-2 flex flex-col gap-y-1 w-full"
          >
            {messages.map((msg) => (
              <IndividualMessage
                key={msg.id}
                message={msg}
                userGuess={userGuess}
              />
            ))}
          </motion.ul>
          <div ref={bottomOfMessagesRef} />
        </CardContent>
      </ScrollArea>

      <CardFooter className="mt-auto">
        {/* <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
          >
            <SendIcon size={20} />
          </Button>
        </div> */}
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleKeyDown={handleKeyDown}
          onClick={sendMessage}
        />
      </CardFooter>
    </Card>
  );
}

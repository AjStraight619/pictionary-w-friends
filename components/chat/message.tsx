import { MessageType } from "@/types/types";
import React from "react";
import { motion } from "framer-motion";
import { UserGuessType } from ".";

type MessageProps = {
  message: MessageType;
  userGuess: UserGuessType;
};

const messageVariants = {
  hidden: { opacity: 0, x: "-100%" },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export const IndividualMessage = React.memo(
  ({ message, userGuess }: MessageProps) => {
    return (
      <motion.li
        className="text-wrap"
        key={message.id}
        variants={messageVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="font-bold">{message.username}:</span>{" "}
        <span
          className={` ${
            userGuess.isCorrect && userGuess.messageId === message.id
              ? "text-green-500"
              : userGuess.isClose && userGuess.messageId === message.id
              ? "text-yellow-500"
              : ""
          }
    `}
        >
          {message.content}
        </span>
      </motion.li>
    );
  }
);

IndividualMessage.displayName = "Message";

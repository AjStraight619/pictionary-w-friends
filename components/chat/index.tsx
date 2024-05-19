"use client";
import { useStorage } from "@/liveblocks.config";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

export default function Chat() {
  const messages = useStorage((root) => root.messages);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>
        <Input />
      </CardFooter>
    </Card>
  );
}

import { ReactNode } from "react";
import { Dialog } from "../ui/dialog";
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

type RoomDialogProps = {
  children: ReactNode;
  triggerName: string;
};

export default function RoomDialog({ children, triggerName }: RoomDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">{triggerName}</Button>
      </DialogTrigger>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

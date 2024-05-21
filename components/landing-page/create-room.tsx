import { CreateRoomSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState, useTransition } from "react";
import { createRoom } from "@/actions/room";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [error, setError] = useState("");
  const { push } = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof CreateRoomSchema>>({
    resolver: zodResolver(CreateRoomSchema),
    defaultValues: {
      name: "My room",
      isOpen: false,
      maxPlayers: 5,
    },
  });

  const onSubmit = (values: z.infer<typeof CreateRoomSchema>) => {
    setError("");
    startTransition(() => {
      createRoom(values).then((data) => {
        if (!data) {
          setError("Something went wrong, try again");
          return;
        }
        if (data.success) {
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <Input placeholder="My room" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isOpen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Open</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxPlayers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Players</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

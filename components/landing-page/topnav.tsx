import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import { getPlayerRooms } from "@/actions/getData";
import JoinOldRoom from "./join-old-room";

export default async function Topnav() {
  const userRooms = await getPlayerRooms();
  return (
    <nav className="fixed top-0 h-16 border-b border-muted-foreground w-full">
      <div className="flex items-center justify-between container h-full gap-x-2 px-2">
        <div></div>
        <JoinOldRoom userRooms={userRooms} />
        <SignedOut>
          <Button asChild>
            <SignInButton>Sign in</SignInButton>
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";

export default function Topnav() {
  return (
    <nav className="fixed top-0 h-16 border-b border-muted-foreground w-full">
      <div className="flex items-center justify-between container h-full  px-2">
        <div></div>
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

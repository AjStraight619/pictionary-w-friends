import { Liveblocks } from "@liveblocks/node";
import { redirect } from "next/navigation";
import { User, auth, currentUser } from "@clerk/nextjs/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const { room } = await request.json();
  //   const user = (await currentUser()) as User;

  //   console.log("user in lb api: ", user.firstName);

  const userSession = auth();

  const curUser = (await currentUser()) as User;

  const user = generateTestUser();

  const userInfo = {
    id: curUser.id,
    info: {
      id: curUser.id,
      username: curUser.firstName,
    },
  };
  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    curUser.id,
    { userInfo: user.info } // Optional
  );

  // Use a naming pattern to allow access to rooms with wildcards
  // Giving the user read access on their org, and write access on their group
  //   session.allow(`${user.organization}`, session.READ_ACCESS);
  session.allow(`${room}`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}

const generateTestUser = () => {
  const randomNum = Math.floor(Math.random() * 1000);
  return {
    id: `${randomNum}`,
    info: {
      username: `Player ${randomNum}`,
    },
  };
};

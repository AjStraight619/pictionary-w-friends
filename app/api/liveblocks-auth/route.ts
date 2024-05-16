import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const { room } = await request.json();
  //   const user = (await currentUser()) as User;

  //   console.log("user in lb api: ", user.firstName);

  const user = generateTestUser();
  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    user.id,
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

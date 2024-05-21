import { Liveblocks } from "@liveblocks/node";
import { redirect } from "next/navigation";
import { User, auth, currentUser } from "@clerk/nextjs/server";
import { getPlayerRooms } from "@/actions/getData";
import { UserRooms } from "@/types/types";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  try {
    const { room } = await request.json();
    const curUser = await currentUser();

    if (!curUser) {
      return new Response(
        JSON.stringify({ message: "You must be logged in to join a room" }),
        {
          status: 401,
        }
      );
    }

    const userRooms = await getPlayerRooms();

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
      { userInfo: userInfo.info } // Optional
    );

    // Use a naming pattern to allow access to rooms with wildcards
    // Giving the user read access on their org, and write access on their group
    session.allow(`${room}`, session.FULL_ACCESS);

    // Authorize the user and return the result
    const { status, body } = await session.authorize();
    console.log("status: ", status, "body: ", body);
    return new Response(body, { status });
  } catch (error) {
    console.error("Error in POST /api/liveblocks-auth: ", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

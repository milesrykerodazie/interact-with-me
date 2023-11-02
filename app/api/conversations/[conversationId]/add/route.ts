import { getCurrentUser } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { pusherServer } from "@/app/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

interface ConversationIdParams {
  conversationId?: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: ConversationIdParams }
) {
  const { conversationId } = params;
  const currentUser = await getCurrentUser();
  const body = await request.json();
  const { userIds } = body;

  if (!currentUser?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const existingConversation = await db.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      users: true,
      groupImage: true,
      messages: {
        include: {
          messageImage: true,
        },
      },
    },
  });

  if (!existingConversation) {
    return NextResponse.json(
      { success: false, message: "Invalid ID" },
      { status: 404 }
    );
  }

  if (existingConversation?.groupOwner !== currentUser?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  //find the users with the id coming
  const foundUsers = await Promise.all(
    userIds?.map(
      async (user: { value: string }) =>
        await db.user.findUnique({
          where: {
            id: user?.value,
          },
        })
    )
  );

  //add members to the group
  await db.conversation.update({
    where: {
      id: existingConversation?.id,
    },
    data: {
      users: {
        connect: [
          ...userIds?.map((user: { value: string }) => ({
            id: user?.value,
          })),
        ],
      },
    },
  });

  foundUsers.forEach((user) => {
    if (user?.email) {
      pusherServer.trigger(
        user?.email,
        "conversation:new",
        existingConversation
      );
    }
  });

  return NextResponse.json(
    { success: true, message: "Added to group" },
    { status: 200 }
  );
}

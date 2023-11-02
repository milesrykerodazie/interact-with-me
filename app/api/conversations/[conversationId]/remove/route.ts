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
  const { userId } = body;

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

  // verify user to be removed
  const foundUser = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!foundUser) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  //REMOVE MEMBER FROM THE GROUP BY DISCONNECTING THE MEMBER

  await db.conversation.update({
    where: {
      id: existingConversation?.id,
    },
    data: {
      users: {
        disconnect: {
          id: foundUser?.id,
        },
      },
    },
  });

  //pusher trigger
  pusherServer.trigger(
    foundUser?.email!,
    "conversation:leave",
    existingConversation
  );

  return NextResponse.json(
    { success: true, message: "Member Removed" },
    { status: 200 }
  );
}

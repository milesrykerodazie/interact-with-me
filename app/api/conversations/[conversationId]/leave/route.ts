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

  //LEAVE THE GROUP BY DISCONNECTING THE USER

  await db.conversation.update({
    where: {
      id: existingConversation?.id,
    },
    data: {
      users: {
        disconnect: {
          id: currentUser?.user?.id,
        },
      },
    },
  });

  //pusher trigger
  pusherServer.trigger(
    currentUser?.user?.email!,
    "conversation:leave",
    existingConversation
  );

  return NextResponse.json(
    { success: true, message: "Left group" },
    { status: 200 }
  );
}

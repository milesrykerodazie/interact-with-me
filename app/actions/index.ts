import { getCurrentUser } from "@/app/lib/auth";
import { db } from "../lib/db";

export async function getUsers() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: currentUser?.user?.email,
        },
      },
    });

    const newArray = users.map(({ password, ...rest }) => rest);

    return newArray;
  } catch (error) {
    return [];
  }
}

export async function getConversations() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return;
  }

  try {
    const conversations = await db.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser?.user?.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return conversations;
  } catch (error: any) {
    return [];
  }
}

export async function getConversationById(conversationId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.user?.email) {
      return null;
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    return conversation;
  } catch (error: any) {
    return null;
  }
}

export async function getMessages(conversationId: string) {
  try {
    const messages = await db.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  } catch (error: any) {
    return [];
  }
}

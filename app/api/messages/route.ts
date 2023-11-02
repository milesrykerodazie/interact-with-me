import { getCurrentUser } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";
import { pusherServer } from "@/app/lib/pusher";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, conversationId } = body;

    if (!currentUser?.user?.id || !currentUser?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (image) {
      //upload image
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "simple_messaging_app/message/image",
      });

      const newMessage = await db.message.create({
        include: {
          seen: true,
          sender: true,
        },
        data: {
          image: uploadedImage?.secure_url,
          conversation: {
            connect: { id: conversationId },
          },
          sender: {
            connect: { id: currentUser?.user?.id },
          },
          seen: {
            connect: {
              id: currentUser?.user?.id,
            },
          },
        },
      });

      if (!newMessage) {
        return NextResponse.json(
          { success: false, message: "Message not sent." },
          { status: 500 }
        );
      }

      //save server image to db
      await db.messageImage.create({
        data: {
          public_id: uploadedImage?.public_id,
          url: uploadedImage?.secure_url,
          messageId: newMessage?.id,
        },
      });

      const updatedConversation = await db.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastMessageAt: new Date(),
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
        include: {
          users: true,
          messages: {
            include: {
              seen: true,
            },
          },
        },
      });

      await pusherServer.trigger(conversationId, "messages:new", newMessage);

      const lastMessage =
        updatedConversation.messages[updatedConversation.messages.length - 1];

      updatedConversation.users.map((user) => {
        pusherServer.trigger(user.email!, "conversation:update", {
          id: conversationId,
          messages: [lastMessage],
        });
      });

      return NextResponse.json(
        { success: true, message: "Message sent.", newMessage },
        { status: 201 }
      );
    }

    if (message) {
      const newMessage = await db.message.create({
        include: {
          seen: true,
          sender: true,
        },
        data: {
          body: message,
          conversation: {
            connect: { id: conversationId },
          },
          sender: {
            connect: { id: currentUser?.user?.id },
          },
          seen: {
            connect: {
              id: currentUser?.user?.id,
            },
          },
        },
      });

      if (!newMessage) {
        return NextResponse.json(
          { success: false, message: "Message not sent." },
          { status: 500 }
        );
      }

      const updatedConversation = await db.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastMessageAt: new Date(),
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
        include: {
          users: true,
          messages: {
            include: {
              seen: true,
            },
          },
        },
      });

      await pusherServer.trigger(conversationId, "messages:new", newMessage);

      const lastMessage =
        updatedConversation.messages[updatedConversation.messages.length - 1];

      updatedConversation.users.map((user) => {
        pusherServer.trigger(user.email!, "conversation:update", {
          id: conversationId,
          messages: [lastMessage],
        });
      });

      return NextResponse.json(
        { success: true, message: "Message sent.", newMessage },
        { status: 201 }
      );
    }
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}

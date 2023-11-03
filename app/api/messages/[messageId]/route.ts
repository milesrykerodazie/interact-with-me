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

interface MessageParams {
  messageId?: string;
}

export async function PATCH(
  req: Request,
  { params }: { params: MessageParams }
) {
  try {
    const currentUser = await getCurrentUser();
    const { messageId } = params;
    const body = await req.json();
    const { newMessage } = body;

    if (!currentUser?.user?.id || !currentUser?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // find the message with the message id
    const foundMessage = await db.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!foundMessage) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 404 }
      );
    }

    if (foundMessage?.senderId !== currentUser?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const updatedMessage = await db.message.update({
      where: {
        id: foundMessage?.id,
      },
      data: {
        body: newMessage,
      },
      include: {
        sender: true,
        seen: true,
      },
    });

    // Update last message seen
    await pusherServer.trigger(
      foundMessage?.conversationId!,
      "message:edited",
      updatedMessage
    );

    return NextResponse.json(
      { success: true, message: "Message edited." },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: MessageParams }
) {
  try {
    const currentUser = await getCurrentUser();
    const { messageId } = params;

    if (!currentUser?.user?.id || !currentUser?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // find the message with the message id
    const foundMessage = await db.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        sender: true,
        seen: true,
        messageImage: true,
      },
    });

    if (!foundMessage) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 404 }
      );
    }

    if (foundMessage?.senderId !== currentUser?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (foundMessage?.messageImage !== null) {
      await cloudinary.uploader.destroy(foundMessage?.messageImage?.public_id);
    }

    const deletedMessage = await db.message.delete({
      where: {
        id: foundMessage?.id,
      },
      include: {
        sender: true,
        seen: true,
        messageImage: true,
      },
    });

    // Update last message seen
    await pusherServer.trigger(
      foundMessage?.conversationId!,
      "message:removed",
      deletedMessage
    );

    return NextResponse.json(
      { success: true, message: "Message deleted." },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}

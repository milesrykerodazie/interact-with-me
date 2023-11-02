import { getCurrentUser } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { pusherServer } from "@/app/lib/pusher";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name, imageUrl } = body;

    if (!currentUser?.user?.id || !currentUser?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      );
    }

    //for group messages
    if (isGroup) {
      // upload group image
      const uploadedImage = await cloudinary.uploader.upload(imageUrl, {
        folder: "simple_messaging_app/group/image",
      });

      const newConversation = await db.conversation.create({
        data: {
          name,
          isGroup,
          groupOwner: currentUser?.user?.id,
          groupConversationImage: uploadedImage?.secure_url,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser?.user?.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      //save the image in the database for reference

      await db.groupImage.create({
        data: {
          public_id: uploadedImage?.public_id,
          url: uploadedImage?.secure_url,
          conversationId: newConversation?.id,
        },
      });

      // Update all connections with new conversation
      newConversation.users.forEach((user) => {
        if (user?.email) {
          pusherServer.trigger(
            user?.email,
            "conversation:new",
            newConversation
          );
        }
      });

      // return NextResponse.json(newConversation);
      return NextResponse.json(
        {
          success: true,
          message: "Group Created.",
          newConversation,
        },
        { status: 201 }
      );
    }

    //checking if a conversation already exists
    const existingConversations = await db.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser?.user?.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser?.user?.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    //creating a new private conversation
    const newConversation = await db.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser?.user?.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    // Update all connections with new conversation
    newConversation.users.map((user) => {
      if (user?.email) {
        pusherServer.trigger(user?.email, "conversation:new", newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

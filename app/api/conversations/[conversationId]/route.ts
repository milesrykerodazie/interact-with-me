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

interface ConversationIdParams {
  conversationId?: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: ConversationIdParams }
) {
  try {
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

    //the image messages
    const messageImages = existingConversation?.messages?.filter(
      (message) => message?.image
    );

    if (existingConversation?.isGroup === null) {
      if (existingConversation?.userIds?.length > 1) {
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

        existingConversation.users.forEach((user) => {
          if (user.email) {
            pusherServer.trigger(
              user.email,
              "conversation:remove",
              existingConversation
            );
          }
        });

        return NextResponse.json(
          { success: true, message: "Conversation Deleted" },
          { status: 200 }
        );
      }

      //to delete the messages from cloudinary
      if (existingConversation?.userIds?.length === 1) {
        messageImages?.length > 0 &&
          (await Promise.all(
            messageImages?.map((image) =>
              cloudinary.uploader.destroy(image?.messageImage?.public_id!)
            )
          ));

        await db.conversation.deleteMany({
          where: {
            id: conversationId,
            userIds: {
              hasSome: [currentUser?.user?.id],
            },
          },
        });

        existingConversation.users.forEach((user) => {
          if (user.email) {
            pusherServer.trigger(
              user.email,
              "conversation:remove",
              existingConversation
            );
          }
        });

        return NextResponse.json(
          { success: true, message: "Conversation Deleted" },
          { status: 200 }
        );
      }
    } else {
      if (existingConversation?.groupOwner !== currentUser?.user?.id) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }
      // if image exists in the conversation
      if (existingConversation?.groupImage !== null) {
        await cloudinary.uploader.destroy(
          existingConversation?.groupImage?.public_id
        );
      }

      messageImages?.length > 0 &&
        (await Promise.all(
          messageImages?.map((image) =>
            cloudinary.uploader.destroy(image?.messageImage?.public_id!)
          )
        ));

      await db.conversation.deleteMany({
        where: {
          id: conversationId,
          userIds: {
            hasSome: [currentUser?.user?.id],
          },
        },
      });

      existingConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(
            user.email,
            "conversation:remove",
            existingConversation
          );
        }
      });

      return NextResponse.json(
        { success: true, message: "Conversation Deleted" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: ConversationIdParams }
) {
  const { conversationId } = params;
  const currentUser = await getCurrentUser();
  const body = await req.json();
  const { name, imageUrl } = body;

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
    },
  });

  if (!existingConversation) {
    return NextResponse.json(
      { success: false, message: "Invalid ID" },
      { status: 404 }
    );
  }

  if (
    !existingConversation?.isGroup &&
    existingConversation?.groupOwner !== currentUser?.user?.id
  ) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  //update group here

  if (imageUrl !== "") {
    //check for existing image
    if (existingConversation?.groupImage) {
      await cloudinary.uploader.destroy(
        existingConversation?.groupImage?.public_id
      );

      //upload new image
      const uploadedImage = await cloudinary.uploader.upload(imageUrl, {
        folder: "simple_messaging_app/group/image",
      });

      //update conversation
      await db.conversation.update({
        where: {
          id: existingConversation?.id,
        },
        data: {
          groupConversationImage: uploadedImage?.secure_url,
          name: name,
        },
      });

      // update image in database
      await db.groupImage.update({
        where: {
          id: existingConversation?.groupImage?.id,
        },
        data: {
          public_id: uploadedImage?.public_id,
          url: uploadedImage?.secure_url,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Group Updated.",
        },
        { status: 200 }
      );
    } else {
      //upload new image
      const uploadedImage = await cloudinary.uploader.upload(imageUrl, {
        folder: "simple_messaging_app/group/image",
      });

      //update conversation
      await db.conversation.update({
        where: {
          id: existingConversation?.id,
        },
        data: {
          groupConversationImage: uploadedImage?.secure_url,
          name: name,
        },
      });

      // update image in database
      await db.groupImage.update({
        where: {
          id: existingConversation?.groupImage?.id,
        },
        data: {
          public_id: uploadedImage?.public_id,
          url: uploadedImage?.secure_url,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Group Updated.",
        },
        { status: 200 }
      );
    }
  } else {
    //update conversation
    await db.conversation.update({
      where: {
        id: existingConversation?.id,
      },
      data: {
        name: name,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Group Updated.",
      },
      { status: 200 }
    );
  }
}

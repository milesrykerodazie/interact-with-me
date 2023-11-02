import { getCurrentUser } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { name, image, bio, username } = body;

    if (!currentUser?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    //find the server and include the image
    const foundUser = await db.user.findUnique({
      where: {
        id: currentUser?.user?.id,
      },
      include: {
        userImage: true,
      },
    });

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found.",
        },
        { status: 404 }
      );
    }

    //unique username
    const usernameExists = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (usernameExists && usernameExists?.id !== foundUser?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already in use.",
        },
        { status: 409 }
      );
    }

    if (image) {
      //delete the previous image from cloudinary and database
      if (foundUser?.userImage !== null) {
        await cloudinary.uploader.destroy(foundUser?.userImage?.public_id);

        //upload a new image
        const uploadedImage = await cloudinary.uploader.upload(image, {
          folder: "simple_messaging_app/users/image",
        });

        //update the user image database
        await db.userImage.update({
          where: {
            id: foundUser?.userImage?.id,
          },
          data: {
            public_id: uploadedImage?.public_id,
            url: uploadedImage?.secure_url,
          },
        });

        //update user profile
        const updateProfile = await db.user.update({
          where: {
            id: foundUser?.id,
          },
          data: {
            name: name,
            image: uploadedImage?.secure_url,
            username: username,
            bio: bio,
          },
        });

        if (updateProfile) {
          return NextResponse.json(
            { success: true, message: "User Profile Updated" },
            { status: 201 }
          );
        } else {
          return NextResponse.json(
            { success: false, message: "User Profile Not Updated" },
            { status: 400 }
          );
        }
      } else {
        //upload a new image
        const uploadedImage = await cloudinary.uploader.upload(image, {
          folder: "simple_messaging_app/users/image",
        });

        //update the server image
        await db.userImage.create({
          data: {
            public_id: uploadedImage?.public_id,
            url: uploadedImage?.secure_url,
            userId: foundUser?.id,
          },
        });

        //update user profile
        const updateProfile = await db.user.update({
          where: {
            id: foundUser?.id,
          },
          data: {
            name: name,
            image: uploadedImage?.secure_url,
            username: username,
            bio: bio,
          },
        });

        if (updateProfile) {
          return NextResponse.json(
            { success: true, message: "User Profile Updated" },
            { status: 201 }
          );
        } else {
          return NextResponse.json(
            { success: false, message: "User Profile Not Updated" },
            { status: 400 }
          );
        }
      }
    } else {
      //update profile
      const updateProfile = await db.user.update({
        where: {
          id: foundUser?.id,
        },
        data: {
          name: name,
          username: username,
          bio: bio,
        },
      });

      if (updateProfile) {
        return NextResponse.json(
          { success: true, message: "User profile Updated" },
          { status: 201 }
        );
      } else {
        return NextResponse.json(
          { success: false, message: "User profile not Updated" },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    //find the server and include the image
    const foundUser = await db.user.findUnique({
      where: {
        id: currentUser?.user?.id,
      },
      include: {
        userImage: true,
      },
    });

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found.",
        },
        { status: 404 }
      );
    }

    if (foundUser?.userImage !== null) {
      await cloudinary.uploader.destroy(foundUser?.userImage?.public_id);
    }

    const deletedUser = await db.user.delete({
      where: {
        id: foundUser?.id,
      },
    });

    if (deletedUser) {
      return NextResponse.json(
        {
          success: true,
          message: "Account deleted.",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "User Not Deleted.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server Error.",
      },
      { status: 500 }
    );
  }
}

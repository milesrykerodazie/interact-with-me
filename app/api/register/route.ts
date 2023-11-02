import { NextResponse } from "next/server";
import * as argon from "argon2";
import { db } from "@/app/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  //checking if email already exists
  const emailExists = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (emailExists) {
    return NextResponse.json(
      {
        success: false,
        message: "Email Already Exists.",
      },
      { status: 409 }
    );
  }

  //encrypting password
  const hashedPassword = await argon.hash(password);

  const defaultImage =
    "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-0.jpg";

  const newUser = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  if (newUser) {
    return NextResponse.json(
      {
        success: true,
        message: "Registered successfully.",
      },
      { status: 201 }
    );
  }
}

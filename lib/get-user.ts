import { db } from "@/app/lib/db";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export const CurrentProfile = async (req: NextApiRequest) => {
  const isAuth = await getToken({ req, secret });

  if (!isAuth) {
    return null;
  }

  const profile = await db.user.findUnique({
    where: {
      email: isAuth?.email!,
    },
  });

  return profile;
};

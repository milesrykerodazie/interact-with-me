import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  //is user authenticated
  const isAuth = await getToken({ req, secret });

  const pathname = req.nextUrl.pathname;

  const pathsToCheck = ["/conversations"];

  if (isAuth !== null && pathname.includes("/auth")) {
    return NextResponse.redirect(new URL("/conversations", req.url));
  }

  if (isAuth === null && pathsToCheck.some((path) => pathname.includes(path))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname === "/" && isAuth !== null) {
    return NextResponse.redirect(new URL("/conversations", req.url));
  }
}

export const config = {
  matcher: ["/", "/auth/:path*", "/conversations/:path*"],
};

// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/src/utils/auth";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  removeAuthCookie(response);
  return response;
}

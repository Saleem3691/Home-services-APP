// app/api/auth/logout/route.js
import { removeAuthCookie } from "@/src/utils/auth";

export async function POST() {
  const response = Response.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  removeAuthCookie(response);
  return response;
}

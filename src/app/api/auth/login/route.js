// app/api/auth/login/route.js
import { User } from "@/src/models/User";
import { generateToken, setAuthCookie } from "@/src/utils/auth";
import { connectDB } from "@/src/utils/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  await connectDB();

  try {
    const { email, password } = await request.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate token
    const token = generateToken(user);

    // Set cookie
    const response = Response.json(
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      { status: 200 }
    );

    setAuthCookie(token, response);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

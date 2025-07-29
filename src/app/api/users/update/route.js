import { getCurrentUser } from "@/src/utils/auth";
import connectDB from "@/src/utils/mongodb";
import User from "@/src/models/User";

export async function PATCH(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { name, email, avatar } = await request.json();
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name, email, avatar },
      { new: true }
    );

    return Response.json({
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error("Update error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

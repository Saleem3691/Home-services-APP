// app/api/providers/[id]/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/utils/auth";
import { connectDB } from "@/src/utils/db";
import User from "@/src/models/User";

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Verify the user is authenticated
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Provider ID is required" },
        { status: 400 }
      );
    }

    // Only allow users to access their own provider data
    if (currentUser._id.toString() !== id && currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized to access this resource" },
        { status: 403 }
      );
    }

    const provider = await User.findById(id).select("-password");
    if (!provider || provider.role !== "provider") {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error("Provider fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
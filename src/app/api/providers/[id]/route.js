// app/api/providers/[id]/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/utils/auth";
import connectDB from "@/src/utils/mongodb";
import User from "@/src/models/User";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "provider") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Await params to destructure id safely
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Provider ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid provider ID format" },
        { status: 400 }
      );
    }

    // Only allow users to access their own provider data
    if (user._id.toString() !== id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized to access this resource" },
        { status: 403 }
      );
    }

    // Find the provider by ID
    const provider = await User.findOne({
      _id: id,
      role: "provider",
    }).select("-password");

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, ...provider.toObject() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching provider data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch provider data" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    // Get the id from params
    const { id } = params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid provider ID format" },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const updateData = await request.json();

    // Validate update data
    if (
      typeof updateData.isVerified !== "boolean" ||
      typeof updateData.isActive !== "boolean"
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid update data" },
        { status: 400 }
      );
    }

    // Find and update the provider
    const provider = await User.findOneAndUpdate(
      { _id: id, role: "provider" },
      {
        $set: {
          isVerified: updateData.isVerified,
          isActive: updateData.isActive,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider not found" },
        { status: 404 }
      );
    }

    // Return the updated provider
    return NextResponse.json({
      success: true,
      provider: provider.toObject(),
    });
  } catch (error) {
    console.error("Error updating provider:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

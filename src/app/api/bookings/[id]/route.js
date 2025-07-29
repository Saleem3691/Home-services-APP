import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/utils/auth";
import connectDB from "@/src/utils/mongodb";
import Booking from "@/src/models/Booking";
import mongoose from "mongoose";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid booking ID format" },
        { status: 400 }
      );
    }

    const { status, cancellationReason } = await request.json();

    // Find the booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to update this booking
    if (
      user.role === "provider" &&
      booking.providerId.toString() !== user._id.toString()
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to update this booking" },
        { status: 403 }
      );
    }

    // If status is being changed to cancelled, require a reason
    if (status === "cancelled" && !cancellationReason) {
      return NextResponse.json(
        { success: false, error: "Cancellation reason is required" },
        { status: 400 }
      );
    }

    // Update booking using findByIdAndUpdate
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          ...(status === "cancelled" && { cancellationReason }),
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, error: "Failed to update booking" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, booking: updatedBooking },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid booking ID format" },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(id)
      .populate("customerId", "name email phone")
      .populate("providerId", "name email phone businessName");

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to view this booking
    if (
      (user.role === "customer" &&
        booking.customerId._id.toString() !== user._id.toString()) ||
      (user.role === "provider" &&
        booking.providerId._id.toString() !== user._id.toString())
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to view this booking" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, booking }, { status: 200 });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

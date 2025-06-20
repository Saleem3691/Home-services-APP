// app/api/bookings/[id]/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/utils/auth";
import { connectDB } from "@/src/utils/db";
import Booking from "@/src/models/Booking";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    // Verify the user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const { status } = await request.json();

    // Find the booking first to verify ownership if needed
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // If user is a provider, verify they own this booking
    if (
      user.role === "provider" &&
      booking.providerId.toString() !== user._id.toString()
    ) {
      return NextResponse.json(
        { error: "Unauthorized to update this booking" },
        { status: 403 }
      );
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    // Convert to plain object and transform _id to id
    const bookingObj = updatedBooking.toObject();
    bookingObj.id = bookingObj._id.toString();
    delete bookingObj._id;

    return NextResponse.json(
      {
        success: true,
        booking: bookingObj,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

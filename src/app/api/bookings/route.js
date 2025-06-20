// app/api/bookings/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/utils/auth";
import { connectDB } from "@/src/utils/db";
import Booking from "@/src/models/Booking";

export async function GET(request) {
  try {
    await connectDB();

    // Verify the user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("providerId");

    // If user is a provider, only fetch their bookings
    const query = { providerId: user._id };
    
    // If admin is requesting specific provider's bookings
    if (user.role === "admin" && providerId) {
      query.providerId = providerId;
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Convert to plain objects and transform _id to id
    const bookingsWithId = bookings.map((booking) => {
      const bookingObj = { ...booking };
      bookingObj.id = bookingObj._id.toString();
      delete bookingObj._id;
      return bookingObj;
    });

    return NextResponse.json({ bookings: bookingsWithId });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Validation
    const requiredFields = [
      "serviceName",
      "customerName",
      "customerEmail",
      "phone",
      "date",
      "time",
      "providerId"
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Verify provider exists
    const provider = await User.findById(body.providerId);
    if (!provider || provider.role !== "provider") {
      return NextResponse.json(
        { error: "Service provider not found" },
        { status: 404 }
      );
    }

    // Create booking
    const newBooking = new Booking({
      ...body,
      date: new Date(body.date),
      status: "pending",
    });

    const savedBooking = await newBooking.save();

    // Convert to plain object
    const bookingObj = savedBooking.toObject();
    bookingObj.id = bookingObj._id.toString();
    delete bookingObj._id;

    return NextResponse.json(
      { success: true, booking: bookingObj },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: `Validation failed: ${errors.join(", ")}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
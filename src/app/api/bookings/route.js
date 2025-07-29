import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/utils/auth";
import connectDB from "@/src/utils/mongodb";
import User from "@/src/models/User";
import Booking from "@/src/models/Booking";

export async function POST(request) {
  try {
    // First connect to the database
    await connectDB();

    // Then get the current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookingData = await request.json();

    // Validate required fields
    const requiredFields = [
      "providerId",
      "serviceName",
      "date",
      "time",
      "address",
    ];
    const missingFields = requiredFields.filter((field) => !bookingData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate date format and future date
    const bookingDate = new Date(bookingData.date);
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (bookingDate < new Date()) {
      return NextResponse.json(
        { success: false, error: "Booking date must be in the future" },
        { status: 400 }
      );
    }

    // Validate time format (HH:mm-HH:mm)
    const timeRegex =
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(bookingData.time)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid time format. Use HH:mm-HH:mm format (e.g., 08:00-10:00)",
        },
        { status: 400 }
      );
    }

    // Validate provider ID
    if (!bookingData.providerId) {
      return NextResponse.json(
        { success: false, error: "Provider ID is required" },
        { status: 400 }
      );
    }

    // Find the provider and check if they're verified
    const provider = await User.findOne({
      _id: bookingData.providerId,
      role: "provider",
    });

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider not found" },
        { status: 404 }
      );
    }

    // Check for existing bookings at the same time
    const existingBooking = await Booking.findOne({
      providerId: provider._id,
      date: bookingDate,
      time: bookingData.time,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Provider already has a booking at this time",
        },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = new Booking({
      serviceName: bookingData.serviceName,
      customerId: user._id,
      providerId: provider._id,
      date: bookingDate,
      time: bookingData.time,
      address: bookingData.address,
      message: bookingData.message,
      status: "pending",
      price: bookingData.price || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await booking.save();
    } catch (error) {
      console.error("Error saving booking:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save booking" },
        { status: 500 }
      );
    }

    // Populate the booking with provider and customer details
    try {
      const populatedBooking = await Booking.findById(booking._id)
        .populate("customerId", "name email phone")
        .populate("providerId", "name businessName email phone");

      if (!populatedBooking) {
        throw new Error("Failed to populate booking details");
      }

      return NextResponse.json(
        {
          success: true,
          booking: {
            ...populatedBooking.toObject(),
            _id: populatedBooking._id.toString(),
            customerId: populatedBooking.customerId._id.toString(),
            providerId: populatedBooking.providerId._id.toString(),
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error populating booking:", error);
      return NextResponse.json(
        { success: false, error: "Failed to populate booking details" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let query = {};

    // If user is not admin, only show their bookings
    if (currentUser.role !== "admin") {
      if (currentUser.role === "provider") {
        query = { providerId: currentUser._id };
      } else {
        query = { customerId: currentUser._id };
      }
    }

    // Fetch bookings with populated customer and provider details
    const bookings = await Booking.find(query)
      .populate("customerId", "name email")
      .populate("providerId", "name businessName")
      .sort({ createdAt: -1 });

    // Format the bookings data
    const formattedBookings = bookings.map((booking) => ({
      _id: booking._id.toString(),
      serviceName: booking.serviceName,
      customerName: booking.customerId?.name || "N/A",
      customerEmail: booking.customerId?.email || "N/A",
      providerName: booking.providerId?.name || "N/A",
      providerBusiness: booking.providerId?.businessName || "N/A",
      date: booking.date,
      time: booking.time,
      status: booking.status,
      servicePrice: booking.servicePrice,
      providerId: booking.providerId?._id?.toString(),
      customerId: booking.customerId?._id?.toString(),
      createdAt: booking.createdAt,
    }));

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

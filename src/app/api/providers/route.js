// app/api/providers/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/utils/auth";
import connectDB from "@/src/utils/mongodb";
import User from "@/src/models/User";

// Service type mapping
const serviceTypeMap = {
  plumbing: "plumbing",
  electrical: "electrical",
  "car-repair": "car repair",
  "car-maintenance": "car repair",
  "home-cleaning": "cleaning",
  "ac-repair": "ac repair",
  "appliance-repair": "appliance repair",
};

export async function GET(request) {
  try {
    const currentUser = await getCurrentUser();

    // Allow access for both admin and authenticated users
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get service type from query params
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get("service");

    // Build query
    const query = { role: "provider", isActive: true };
    if (serviceType) {
      // Map the URL service type to database service type
      const mappedServiceType = serviceTypeMap[serviceType] || serviceType;
      // Use case-insensitive search with regex
      query.services = { $regex: new RegExp(mappedServiceType, "i") };
    }

    const providers = await User.find(query)
      .select(
        "name email phone businessName services rating avatar location description"
      )
      .sort({ rating: -1 });

    return NextResponse.json({
      success: true,
      providers: providers.map((provider) => ({
        ...provider.toObject(),
        _id: provider._id.toString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// app/api/providers/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/src/utils/db";
import { User } from "@/src/models/User";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    let service = searchParams.get("service");

    // Service name normalization mapping
    const serviceMap = {
      "car-maintenance": "Car Repair",
      "home-cleaning" : "Cleaning",
      'appliance-repair': "Appliance Repair"
    };

    // Case-insensitive search setup
    const query = {
      role: "provider",
      isActive: true,
    };

    if (service) {
      // Normalize the service name first
      service = service.toLowerCase();
      service = serviceMap[service] || service;

      // Then use regex for case-insensitive search
      query.services = {
        $regex: new RegExp(`^${service}$`, "i"),
      };
    }

    const providers = await User.find(query)
      .select("-password -__v -verificationDocuments")
      .sort({ rating: -1, isVerified: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      providers: providers.map((provider) => ({
        ...provider,
        _id: provider._id.toString(),
        createdAt: provider.createdAt.toISOString(),
        updatedAt: provider.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

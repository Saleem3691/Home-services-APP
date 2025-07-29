import connectDB from "@/src/utils/mongodb";
import Booking from "@/src/models/Booking";
import Provider from "@/src/models/Provider";

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const clerkUserId = searchParams.get("clerkUserId");

    const provider = await Provider.findOne({ clerkUserId });
    if (!provider)
      return new Response(JSON.stringify({ error: "Provider not found" }), {
        status: 404,
      });

    const bookings = await Booking.find({
      providerId: provider._id,
      serviceName: { $in: provider.services },
    }).sort({ createdAt: -1 });

    return new Response(JSON.stringify({ bookings }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

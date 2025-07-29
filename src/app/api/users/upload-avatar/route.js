import { getCurrentUser } from "@/src/utils/auth";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/src/utils/mongodb";
import User from "@/src/models/User";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream({ folder: "avatars" }, (error, result) => {
          if (error) throw error;
          resolve(result);
        })
        .end(buffer);
    });

    await connectDB();
    await User.findByIdAndUpdate(user._id, {
      avatar: uploadResult.secure_url,
    });

    return Response.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

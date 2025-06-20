import { NextResponse } from "next/server";
import ContactMessage from "@/src/models/ContactMessage";
import dbConnect from "@/src/utils/db";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validation
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Save to database
    const newMessage = new ContactMessage(body);
    await newMessage.save();

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/src/utils/mongodb";
import { generateToken, setAuthCookie } from "@/src/utils/auth";
import User from "@/src/models/User";

export async function POST(request) {
  try {
    const {
      name,
      email,
      password,
      role = "customer",
      phone,
      businessName,
      location,
      experience,
      services,
      description,
      adminCode,
    } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Validate admin registration
    if (role === "admin") {
      if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
        return NextResponse.json(
          { error: "Invalid admin registration code" },
          { status: 403 }
        );
      }
    }

    // Additional validation for providers
    if (role === "provider") {
      if (!businessName || !location || !experience || !services?.length) {
        return NextResponse.json(
          {
            error:
              "Business name, location, experience, and at least one service are required for providers",
          },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with role-specific fields
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      businessName,
      location,
      experience,
      services,
      description,
      isVerified: role === "provider" ? false : true,
      isActive: true,
      availability: "available",
    };

    const newUser = new User(userData);
    await newUser.save();

    const token = generateToken(newUser);
    const response = NextResponse.json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        businessName: newUser.businessName,
        phone: newUser.phone,
        services: newUser.services,
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

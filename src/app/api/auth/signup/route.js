import { User } from "@/src/models/User";
import { generateToken, setAuthCookie } from "@/src/utils/auth";
import { connectDB } from "@/src/utils/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  await connectDB();

  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      businessName,
      phone,
      location,
      experience,
      services,
      description,
      ...rest 
    } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return Response.json(
        { error: "Email already exists", code: "EMAIL_EXISTS" }, 
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const userData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "customer",
      ...(role === "provider" && {
        businessName,
        phone,
        location,
        experience: Number(experience),
        services: services.map(s => s.toLowerCase().trim()),
        description,
        isVerified: false,
        isActive: true,
        rating: 0,
        reviewsCount: 0
      }),
      ...rest
    };

    const user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user);

    // Set cookie
    const response = Response.json(
      { 
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          ...(role === "provider" && {
            businessName: user.businessName,
            services: user.services
          })
        }
      },
      { status: 201 }
    );

    setAuthCookie(token, response);
    return response;

  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { 
        success: false,
        error: error.message || "Internal server error" 
      },
      { status: 500 }
    );
  }
}
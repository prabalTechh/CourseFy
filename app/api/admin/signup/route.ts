import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";

const prisma = new PrismaClient();
export const JWT_SECRET = process.env.JWT_SECRET || "12343214"; // Fallback for development

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { username, password,isAdmin } = await req.json();

    // Validate input
    if (!username || !password) {
      return new Response(
        JSON.stringify({ message: "Please enter the required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "Username already exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        isAdmin
      },
    });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin, // Ensure this is included in the payload
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    

    // Return success response
    return new Response(
      JSON.stringify({
        message: "User created successfully",
        token,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);

    // Handle unexpected errors
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

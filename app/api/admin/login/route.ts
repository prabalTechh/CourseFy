import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../signup/route";  // Ensure that JWT_SECRET is correctly defined
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { username, password } = await req.json();

    // Find the user in the database
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    // If the user doesn't exist
    if (!existingUser) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Compare the password with the hashed password
    const passwordValid = await bcrypt.compare(password, existingUser.password);

    // If password is invalid
    if (!passwordValid) {
      return new Response(
        JSON.stringify({ message: "Invalid username or password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: existingUser.id, username: existingUser.username, isAdmin: existingUser.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    
   

    // Return success response with token
    return new Response(
      JSON.stringify({ message: "User successfully logged in", token }),
      { status: 200, headers: { "Content-Type": "application/json" } },
      
    );

  } catch (error) {
    // Error handling
    console.error(error);
    return new Response(
      JSON.stringify({ message: "An error occurred during login" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

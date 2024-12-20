import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../admin/signup/route";
const prisma = new PrismaClient();

// export async function verifyToken(req: NextRequest) {

//     const authHeader = req.headers.get("Authorization")

//     const token = authHeader as string;

//     const decoded = jwt.verify(token, JWT_SECRET);
//     return decoded;

// }

export async function GET(req: NextRequest) {
  // Log the token to verify its structure

  // Verify the token
  try {
    const courses = await prisma.course.findMany();
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

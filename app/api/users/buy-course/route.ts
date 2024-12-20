import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"; // Adjust the import path to your Prisma client
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../admin/signup/route";

// This will be the handler for the POST request to purchase the course
export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body correctly
    const { courseId } = await req.json();

    // Extract the token from the Authorization header
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const token = authHeader;

    // Decode the token to get user information
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error("JWT Error:", error);
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    if (!decoded || typeof decoded !== "object") {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = (decoded as { id: number }).id;

    // Check if the course already exists for the user
    const existingCourse = await prisma.course.findFirst({
      where: {
        courseId,
        userId,
      },
    });

    if (existingCourse) {
      return new NextResponse(
        JSON.stringify({ message: "Course already purchased" }),
        { status: 400 }
      );
    }

    // Link the course to the user by creating a new record in the relation table
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        courses: {
          connect: {
            courseId: courseId,
          },
        },
      },
    });

    // Respond with success message
    return new NextResponse(
      JSON.stringify({ message: "Course purchased successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

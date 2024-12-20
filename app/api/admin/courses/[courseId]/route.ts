import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../signup/route"; // Ensure this path is correct

const prisma = new PrismaClient();

// // Admin-only PUT route to update a course
// export const PUT = async (
//   req: NextRequest,
//   { params }: { params: { courseId: string } }
// ) => {
//   const { courseId } = params;  // Directly destructure from params

//   try {
//     // Parse the request body
//     const { title, description, price, imageLink, published } = await req.json();

//     // Validate courseId
//     if (!courseId) {
//       return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
//     }

//     const courseIdInt = parseInt(courseId, 10);
//     if (isNaN(courseIdInt)) {
//       return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
//     }

//     // Validate required fields
//     if (!title || !description || price === undefined || !imageLink) {
//       return NextResponse.json(
//         { error: "Missing required fields: title, description, price, or imageLink" },
//         { status: 400 }
//       );
//     }

//     // Get the token from the Authorization header
//     const authorizationHeader = req.headers.get("Authorization")?.split(" ")[1];
//     if (!authorizationHeader) {
//       return NextResponse.json({ error: "Authorization token is missing" }, { status: 401 });
//     }

//     // Verify the token
//     const decoded = jwt.verify(authorizationHeader, JWT_SECRET) as { id: number; isAdmin: boolean };
//     if (!decoded.isAdmin) {
//       return NextResponse.json({ error: "Only admins can update courses" }, { status: 403 });
//     }

//     // Check if the course exists
//     const existingCourse = await prisma.course.findUnique({
//       where: { courseId: courseIdInt },
//     });

//     if (!existingCourse) {
//       return NextResponse.json({ error: "Course not found" }, { status: 404 });
//     }

//     // Update the course
//     const updatedCourse = await prisma.course.update({
//       where: { courseId: courseIdInt },
//       data: { title, description, price, imageLink, published },
//     });

//     return NextResponse.json({ message: "Course updated successfully", updatedCourse }, { status: 200 });
//   } catch (error: any) {
//     console.error("Error updating course:", error.message);
//     return NextResponse.json(
//       { error: "Failed to update the course", details: error.message },
//       { status: 500 }
//     );
//   }
// };

// Admin-only DELETE route to delete a course
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  const { courseId } =  params;  // Directly destructure from params

  try {
    // Validate courseId
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const courseIdInt = parseInt(courseId, 10);
    if (isNaN(courseIdInt)) {
      return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
    }

    // Get the token from the Authorization header
    const authorizationHeader = req.headers.get("Authorization")?.split(" ")[1];
    if (!authorizationHeader) {
      return NextResponse.json({ error: "Authorization token is missing" }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(authorizationHeader, JWT_SECRET) as { id: number; isAdmin: boolean };

    console.log("Decoded JWT:", decoded);

    // Validate admin access
    if (!decoded.isAdmin) {
      console.log("User is not an admin:", decoded);
      return NextResponse.json({ error: "Only admins can delete courses" }, { status: 403 });
    }

    // Check if the course exists
    const existingCourse = await prisma.course.findUnique({
      where: { courseId: courseIdInt },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Delete the course
    await prisma.course.delete({
      where: { courseId: courseIdInt },
    });

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting course:", error.message);
    return NextResponse.json(
      { error: "Failed to delete the course", details: error.message },
      { status: 500 }
    );
  }
};

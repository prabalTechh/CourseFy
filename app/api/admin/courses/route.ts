import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../signup/route";

const prisma = new PrismaClient();




interface ITypeProps {
  title: string;
  description: string;
  price: number;
  imageLink: string;
  published: boolean;
   // Add userId to the request body
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { title, description, price, imageLink, published }: ITypeProps = await req.json();

    // Get the Authorization header
    const authorizationHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authorizationHeader) {
      return new NextResponse(
        JSON.stringify({ error: "Authorization token is missing" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Decode the token and extract the userId
    const token = authorizationHeader;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded.id;

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid token or missing userId" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Ensure the user exists and is an admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!user.isAdmin) {
      return new NextResponse(
        JSON.stringify({ error: "Only admins can add courses" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a new course and associate it with the user
    const createData = await prisma.course.create({
      data: {
        title,
        description,
        price,
        imageLink,
        published,
        user: {
          connect: { id: userId }, // Associate the course with the user
        },
      },
    });

    // Return success response with the created data
    return new NextResponse(
      JSON.stringify({ message: "Course added successfully!", course: createData }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    // Log the error and return an error response
    console.error("Error creating course:", error.message);

    return new NextResponse(
      JSON.stringify({ error: "Failed to create course" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

const SECRET_KEY = JWT_SECRET;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Log the token to verify its structure

    // Verify the token
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log(decoded)
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { error: "Unauthorized: Invalid or malformed token" },
        { status: 401 }
      );
    }

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

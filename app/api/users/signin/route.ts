import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../../admin/signup/route";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json(
      { message: "please enter both the fields!" },
      { status: 400 }
    );
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      try {
        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (isPasswordValid) {
          const token = jwt.sign(
            { id: existingUser.id, username: existingUser.username },
            JWT_SECRET,
            { expiresIn: "1h" }
          );

          return new Response(
            JSON.stringify({ message: "User Logged successfully!", token })
          );
        }
      } catch (error:any) {
        return NextResponse.json(error.message);
      }
    }

    return NextResponse.json(
      { message: "User Created Successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(error.message);
  }
}

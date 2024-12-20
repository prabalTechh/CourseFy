import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";


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
      return NextResponse.json(
        { message: "user Already exists please SignIn!" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRETS as string,
      { expiresIn: "1h" }
    );
    localStorage.setItem("Authorization", token);
    if (user) {
      return new Response(
        JSON.stringify({
          token,
          message: "User Signedup!",
        })
      );
    }

    return NextResponse.json(
      { message: "User Created Successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(error.message);
  }
}

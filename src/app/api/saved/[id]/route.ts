import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Hike from "@/models/Hike";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);
    const hike = await Hike.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!hike) {
      return NextResponse.json({ message: "Hike not found" }, { status: 404 });
    }

    if (user.savedHikes.some((hikeId: mongoose.Types.ObjectId) => hikeId.toString() === hike._id.toString())) {
      return NextResponse.json(
        { message: "Hike already saved" },
        { status: 400 }
      );
    }

    user.savedHikes.push(hike._id);
    await user.save();

    return NextResponse.json(
      { message: "Hike saved successfully", savedHikes: user.savedHikes },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.savedHikes = user.savedHikes.filter(
      (hikeId: mongoose.Types.ObjectId) => hikeId.toString() !== id
    );
    await user.save();

    return NextResponse.json(
      { message: "Hike removed from saved", savedHikes: user.savedHikes },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

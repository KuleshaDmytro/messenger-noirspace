import { NextRequest, NextResponse } from "next/server";
import { rotateRefreshToken } from "@/app/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token required" },
        { status: 400 }
      );
    }

    const { accessToken, refreshToken: newRefreshToken, userId } =
      await rotateRefreshToken(refreshToken);

    return NextResponse.json({ accessToken, refreshToken: newRefreshToken, userId });

  } catch (err) {
    console.error("❌ refresh error:", err);
    return NextResponse.json(
      { error: "Invalid or expired refresh token" },
      { status: 401 }
    );
  }
}
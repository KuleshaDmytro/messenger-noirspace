import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../redis";
import { prisma } from "../prisma";
import crypto from "crypto";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7;

// ─── Access Token ────────────────────────────────────────────────

export function signAccessToken(userId: string): string {
  return jwt.sign(
    { sub: userId, type: "access" },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY, algorithm: "HS256" }
  );
}

export function verifyAccessToken(token: string): JwtPayload {
  const payload = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET!
  ) as JwtPayload;

  if (payload.type !== "access") {
    throw new Error("Invalid token type");
  }

  return payload;
}

// ─── Refresh Token ───────────────────────────────────────────────

export async function createRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_SECONDS * 1000);

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });

  await redis.set(
    `refresh:${token}`,
    userId,
    "EX",
    REFRESH_TOKEN_EXPIRY_SECONDS
  );

  return token;
}

export async function rotateRefreshToken(oldToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  userId: string;
}> {
  const lockKey = `lock:refresh:${oldToken}`;
  const resultKey = `rotated:${oldToken}`;

  // Перевіряємо чи вже є готовий результат від паралельного виклику
  const cached = await redis.get(resultKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const lock = await redis.set(lockKey, "1", "EX", 10, "NX");

  if (!lock) {
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 300));
      const result = await redis.get(resultKey);
      if (result) return JSON.parse(result);
    }
    throw new Error("Rotation lock timeout");
  }

  try {
    const stored = await prisma.refreshToken.findUnique({
      where: { token: oldToken },
      select: { userId: true, revoked: true, expiresAt: true },
    });

    if (!stored) throw new Error("Refresh token not found");

    if (stored.revoked) {
      await revokeAllUserTokens(stored.userId);
      throw new Error("Refresh token reuse detected");
    }

    if (stored.expiresAt < new Date()) {
      await prisma.refreshToken.update({
        where: { token: oldToken },
        data: { revoked: true },
      });
      throw new Error("Refresh token expired");
    }

    const { userId } = stored;

    await prisma.refreshToken.update({
      where: { token: oldToken },
      data: { revoked: true },
    });
    await redis.del(`refresh:${oldToken}`);

    const accessToken = signAccessToken(userId);
    const refreshToken = await createRefreshToken(userId);

    const result = { accessToken, refreshToken, userId };

    await redis.set(resultKey, JSON.stringify(result), "EX", 5);

    return result;
  } finally {
    await redis.del(lockKey);
  }
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  const tokens = await prisma.refreshToken.findMany({
    where: { userId, revoked: false },
    select: { token: true },
  });

  await prisma.refreshToken.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true },
  });

  if (tokens.length > 0) {
    await redis.del(...tokens.map((t) => `refresh:${t.token}`));
  }
}
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      nickName: string;
    };
    accessToken: string;
    refreshToken: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nickName: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: number;
  }
}
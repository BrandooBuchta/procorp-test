import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: "admin" | "user"
    } & DefaultSession["user"]
  }

  interface User {
    role?: "admin" | "user"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: "admin" | "user"
  }
}

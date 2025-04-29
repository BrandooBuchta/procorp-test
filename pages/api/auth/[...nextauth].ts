import NextAuth, { type NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        const validUsers = [
          {
            email: adminEmail,
            password: adminPassword,
            id: "admin-id",
            name: "Admin",
          },
          {
            email: "test@email.com",
            password: "123456",
            id: "test-id",
            name: "Test User",
          },
        ]

        const user = validUsers.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        )

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ baseUrl }: { baseUrl: string }) {
      return `${baseUrl}/dashboard`
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin"
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as "admin" | "user"
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    const isAuthRoute = router.pathname.startsWith("/auth")

    if (!session && !isAuthRoute) {
      router.replace("/auth/sign-in")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return <>{children}</>
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={(pageProps as any).session}>
        <Toaster />
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </SessionProvider>
    </ThemeProvider>

  )
}

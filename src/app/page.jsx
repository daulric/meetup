import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <>
      <Header isLoggedIn={false} />
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to MeetUp</h1>
            <p className="text-muted-foreground mt-2">Your simple video conferencing solution</p>
          </div>
          <div className="space-y-4">
            <Button asChild className="w-full" size="lg">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
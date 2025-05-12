import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { ProfileIcon } from "./profile-icon"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full flex items-center justify-between p-3 sm:p-4 bg-background/80 backdrop-blur-sm border-b h-14 sm:h-16">
      <div className="flex-shrink-0">
        <Link href="/" className="text-lg sm:text-xl font-bold hover:opacity-80 transition-opacity">
          s2
        </Link>
      </div>
      <div className="flex items-center gap-1 sm:gap-4">
        <Link href="/upload">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" aria-label="Upload video">
            <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
        <ModeToggle />
        <ProfileIcon />
      </div>
    </header>
  )
}
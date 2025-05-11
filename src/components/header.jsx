import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { ProfileIcon } from "./profile-icon"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between p-3 sm:p-4 bg-background/80 backdrop-blur-sm border-b h-14 sm:h-16">
      <div className="flex-shrink-0">
        <Link href="/" className="text-lg sm:text-xl font-bold hover:opacity-80 transition-opacity">
          s2
        </Link>
      </div>
      <div className="flex items-center gap-1 sm:gap-4">
        <ModeToggle />
        <ProfileIcon />
      </div>
    </header>
  )
}
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { ProfileIcon } from "./profile-icon"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
      <div>
        <Link href="/" className="text-xl font-bold">
          MeetUp
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <ProfileIcon />
      </div>
    </header>
  )
}

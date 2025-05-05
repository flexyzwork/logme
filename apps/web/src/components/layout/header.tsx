import { getAuthSession } from '@/lib/auth'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { LogoutButton } from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'

export async function Header() {
  const session = await getAuthSession()
  const user = session?.user

  const getInitial = (nameOrEmail: string | null | undefined) => {
    if (!nameOrEmail) return '?'
    const base = nameOrEmail.trim()[0]?.toUpperCase()
    return base ?? '?'
  }

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-b gap-2 sm:gap-0">
      <Link href="/logme" className="text-xl font-bold">
        LOGME
      </Link>

      <nav className="flex flex-wrap justify-center sm:justify-end items-center gap-4 text-sm text-muted-foreground text-center">
        <Link href="/about">About</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/contact">Contact</Link>
        
        {user ? (
          <>
            <Link href="/dashboard">My Blog</Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user.image ? (
                  <Image
                    src={user.image}
                    width={32}
                    height={32}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold">
                    {getInitial(user.name || user.email)}
                  </div>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href="/account" className="w-full text-left">
                    Account
                  </Link>
                </DropdownMenuItem>
                <LogoutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href="/signin">Sign In</Link>
        )}
        <ThemeToggle />
      </nav>
    </header>
  )
}

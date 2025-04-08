// 'use client'

import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { LogoutButton } from '@/components/LogoutButton'

export async function Header() {
  const session = await getServerSession(authConfig)
  const user = session?.user

  const getInitial = (nameOrEmail: string | null | undefined) => {
    if (!nameOrEmail) return '?'
    const base = nameOrEmail.trim()[0]?.toUpperCase()
    return base ?? '?'
  }

  return (
    <header className="flex justify-between items-center px-4 py-3 border-b">
      <Link href="/" className="text-xl font-bold">
        logme
      </Link>

      <nav className="flex items-center gap-4 text-sm text-muted-foreground">
        {user ? (
          <>
            <Link href="/dashboard">대시보드</Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user.image ? (
                  <Image
                    src={user.image}
                    width={32}
                    height={32}
                    alt="프로필"
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
                  <Link href="/settings" className="w-full text-left">
                    내 계정
                  </Link>
                </DropdownMenuItem>

                <LogoutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href="/signin">로그인</Link>
        )}
      </nav>
    </header>
  )
}

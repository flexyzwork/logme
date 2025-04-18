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
    <header className="flex justify-between items-center px-4 py-3 border-b">
      <Link href="/logme" className="text-xl font-bold">
        LOGME
      </Link>

      <nav className="flex items-center gap-4 text-sm text-muted-foreground">
        <Link href="/about">서비스 소개</Link>
        <Link href="/faq">자주 묻는 질문</Link>
        <Link href="/contact">연락하기</Link>
        
        {user ? (
          <>
            <Link href="/dashboard">내 블로그 관리</Link>

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
                  <Link href="/account" className="w-full text-left">
                    계정 관리
                  </Link>
                </DropdownMenuItem>
                <LogoutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href="/signin">로그인</Link>
        )}
        <ThemeToggle />
      </nav>
    </header>
  )
}

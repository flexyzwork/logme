'use client'

import { signOut } from 'next-auth/react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function LogoutButton() {
  return <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/about' })}>로그아웃</DropdownMenuItem>
}

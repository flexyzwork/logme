'use client'

import { getSession, signOut } from 'next-auth/react'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { useAuthStore } from '@/stores/logme/authStore'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { trackEvent } from '@/lib/tracking'

const handleLogout = async () => {
  const session = await getSession()
  if (session?.user?.id) {
    await trackEvent({
      userId: session.user.id,
      event: 'user_logged_out',
    })
  }

  useBuilderStore.getState().reset()
  useAuthStore.getState().reset()

  await signOut({ callbackUrl: '/about' })
}

export function LogoutButton() {
  return <DropdownMenuItem onClick={handleLogout}>로그아웃</DropdownMenuItem>
}

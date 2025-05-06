'use client'

import { getSession, signOut } from 'next-auth/react'
import { useBuilderStore } from '@/modules/logme/stores/builderStore'
import { useAuthStore } from '@/modules/logme/stores/authStore'
import { DropdownMenuItem } from '@/shared/components/ui/dropdown-menu'
import { trackEvent } from '@/shared/lib/tracking'

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
  return <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
}

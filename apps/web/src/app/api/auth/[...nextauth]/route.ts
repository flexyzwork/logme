import NextAuth from 'next-auth'
import { authConfig } from '@/shared/lib/auth'

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }

import { PrismaAdapter } from '@auth/prisma-adapter'
import { getServerSession, type NextAuthOptions } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Email from 'next-auth/providers/email'
import { db } from '@repo/db'

export const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'database',
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT!),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM!,
    }),
  ],
  pages: {
    signIn: '/signin',
    
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        if (session.user.deletedAt) {
          return session
        }
        session.user.id = user.id
        session.user.email = user.email
        session.user.name = user.name
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl) return `${baseUrl}/logme`
      if (url === `${baseUrl}/`) return `${baseUrl}/logme`
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith('/')) return `${baseUrl}${url}`
      return `${baseUrl}/logme`
    },
    async signIn({ user }) {
      const existing = await db.user.findUnique({
        where: { email: user.email ?? '' },
      });

      if (existing?.deletedAt) {
        await db.user.update({
          where: { id: existing.id },
          data: { deletedAt: null },
        });
      }

      return true;
    },
  },
}

export async function getAuthSession() {
  return await getServerSession(authConfig)
}

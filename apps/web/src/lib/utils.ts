import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { db } from '@repo/db'
import slugify from 'slugify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getUniqueSlug(title: string): Promise<string> {
  const base = slugify(title, { lower: true, strict: true })
  let slug = base
  let counter = 1

  while (true) {
    const existing = await db.site.findUnique({ where: { slug } })
    if (!existing) break
    slug = `${base}-${counter}`
    counter++
  }

  return slug
}

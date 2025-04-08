import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  const users = await prisma.user.findMany()

  for (const user of users) {
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        theme: 'system',
        language: 'ko',
      },
    })

    await prisma.userPlan.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        plan: 'free',
      },
    })
    console.log(`User ${user.id} seeded.`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

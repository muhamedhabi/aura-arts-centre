import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Setup admin user
  const hashedPassword = await bcrypt.hash('Admin1@auraarts', 10)
  
  await prisma.user.upsert({
    where: { email: 'auraartscentre.bh@gmail.com' },
    update: { password: hashedPassword },
    create: {
      email: 'auraartscentre.bh@gmail.com',
      password: hashedPassword,
    },
  })

  // Setup initial content
  const initialContent = [
    { key: 'address', value: 'VILLA NO: 2443\nROAD-2762\nAdliya: 327\nNEAR YATEEM GARDENS\nKINGDOM OF BAHRAIN' },
    { key: 'email', value: 'info@auraartscentre.com' },
    { key: 'website', value: 'www.auraartscentre.com' },
    { key: 'phone', value: '+97333105511, +97366623399, +97333442297, +97339694171' },
    { key: 'about', value: 'AURA ARTS IS AN INSTITUTE CONDUCTING STAGE PERFORMANCES, CULTURAL EVENTS, CHOREOGRAPHY, FLASHMOB, AWARD FUNCTIONS, MUSIC VIDEOS, TEACHING MUSICAL INSTRUMENTS, VOCALS, DANCES, ORGANIZING A FILM STARS STAGE PERFORMANCES AND OTHER EVENTS & FORMS.\n\nWE AIMS TO NURTURE AND DEVELOP THE CULTURAL VALUES BY PROVIDING EXPERT GUIDANCE IN COACHING STUDENTS OF ALL AGES AND TALENTS AS WELL AS PERFORMING VARIETY ENTERTAINMENTS.' },
    { key: 'title', value: 'AURA ARTS CENTRE\nKingdom of Bahrain\n\nBRINGING ARTISTIC EXCELLENCE' }
  ]

  for (const item of initialContent) {
    await prisma.content.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: { key: item.key, value: item.value }
    })
  }

  // Setup initial images
  const images = [
    '/gallery/IMG_8634.webp',
    '/gallery/IMG_8635.webp',
    '/gallery/IMG_8636.webp',
    '/gallery/IMG_8637.webp',
    '/gallery/IMG_8638.webp'
  ]

  // delete all old images to prevent duplicates if seeding multiple times
  await prisma.image.deleteMany({})

  for (const image of images) {
    await prisma.image.create({
      data: {
        path: image,
        isVisible: true
      }
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

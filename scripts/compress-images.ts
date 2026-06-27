import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const galleryPath = path.join(process.cwd(), 'public/gallery')
  const files = fs.readdirSync(galleryPath)

  for (const file of files) {
    if (file.endsWith('.AVIF') || file.endsWith('.avif')) {
      const inputPath = path.join(galleryPath, file)
      const outputFilename = file.replace(/\.AVIF$/i, '.webp')
      const outputPath = path.join(galleryPath, outputFilename)

      console.log(`Processing ${file}...`)
      await sharp(inputPath)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath)
      
      console.log(`Saved as ${outputFilename}`)

      // Update database
      const oldPath = `/gallery/${file}`
      const newPath = `/gallery/${outputFilename}`
      
      await prisma.image.updateMany({
        where: { path: oldPath },
        data: { path: newPath }
      })

      await prisma.content.updateMany({
        where: { value: oldPath },
        data: { value: newPath }
      })

      // delete old file
      fs.unlinkSync(inputPath)
    }
  }

  console.log('Conversion complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

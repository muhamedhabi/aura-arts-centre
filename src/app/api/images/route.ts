import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import fs from "fs/promises"
import path from "path"
import sharp from "sharp"

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(images)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let filename = ''

    if (file.type.startsWith('video/')) {
      filename = uniqueSuffix + '-' + file.name.replace(/\s+/g, '_')
      const filepath = path.join(process.cwd(), 'public/gallery', filename)
      await fs.writeFile(filepath, buffer)
    } else {
      filename = uniqueSuffix + '-optimized.webp'
      const filepath = path.join(process.cwd(), 'public/gallery', filename)
      await sharp(buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filepath)
    }

    const image = await prisma.image.create({
      data: {
        path: `/gallery/${filename}`,
        isVisible: true
      }
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import fs from "fs/promises"
import path from "path"
import sharp from "sharp"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "hero" or "about"
    
    if (!file || !type) {
      return NextResponse.json({ error: "Missing file or type" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let filename = ''
    let isVideo = file.type.startsWith('video/')

    if (isVideo) {
      filename = uniqueSuffix + '-' + file.name.replace(/\s+/g, '_')
      const filepath = path.join(process.cwd(), 'public/uploads', filename)
      
      // Ensure directory exists
      await fs.mkdir(path.join(process.cwd(), 'public/uploads'), { recursive: true })
      await fs.writeFile(filepath, buffer)
    } else {
      filename = uniqueSuffix + '-optimized.webp'
      const filepath = path.join(process.cwd(), 'public/uploads', filename)
      
      await fs.mkdir(path.join(process.cwd(), 'public/uploads'), { recursive: true })
      
      await sharp(buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filepath)
    }

    const newPath = `/uploads/${filename}`

    if (type === 'hero') {
      await prisma.content.upsert({
        where: { key: 'heroMediaUrl' },
        update: { value: newPath },
        create: { key: 'heroMediaUrl', value: newPath }
      })
      await prisma.content.upsert({
        where: { key: 'heroMediaType' },
        update: { value: isVideo ? 'video' : 'image' },
        create: { key: 'heroMediaType', value: isVideo ? 'video' : 'image' }
      })
    } else if (type === 'about') {
      await prisma.content.upsert({
        where: { key: 'aboutMediaUrl' },
        update: { value: newPath },
        create: { key: 'aboutMediaUrl', value: newPath }
      })
      await prisma.content.upsert({
        where: { key: 'aboutMediaType' },
        update: { value: isVideo ? 'video' : 'image' },
        create: { key: 'aboutMediaType', value: isVideo ? 'video' : 'image' }
      })
    }

    return NextResponse.json({ success: true, url: newPath })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

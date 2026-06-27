import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import fs from "fs/promises"
import path from "path"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const image = await prisma.image.findUnique({ where: { id } })
    
    if (!image) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Attempt to delete file
    try {
      const filepath = path.join(process.cwd(), 'public', image.path)
      await fs.unlink(filepath)
    } catch (e) {
      console.warn("Could not delete file, perhaps already deleted", e)
    }

    await prisma.image.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    
    const image = await prisma.image.update({
      where: { id },
      data: { isVisible: body.isVisible }
    })
    
    return NextResponse.json(image)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 })
  }
}

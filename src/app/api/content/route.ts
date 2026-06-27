import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/auth"

export async function GET() {
  try {
    const contents = await prisma.content.findMany()
    const contentMap = contents.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, string>)
    
    return NextResponse.json(contentMap)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    
    // expecting data to be a key-value object
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        await prisma.content.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        })
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}

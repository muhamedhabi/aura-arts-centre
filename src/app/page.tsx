import { prisma } from "@/lib/db"
import HomeClient from "@/components/HomeClient"

export const revalidate = 0 // Disable caching for dynamic content

export default async function HomePage() {
  const contents = await prisma.content.findMany()
  const contentMap = contents.reduce((acc, item) => {
    acc[item.key] = item.value
    return acc
  }, {} as Record<string, string>)

  const images = await prisma.image.findMany({
    where: { isVisible: true },
    orderBy: { createdAt: 'desc' }
  })

  return <HomeClient content={contentMap} images={images} />
}

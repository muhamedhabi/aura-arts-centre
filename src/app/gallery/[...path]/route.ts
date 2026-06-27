import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  const filePath = path.join(process.cwd(), 'public', 'gallery', ...params.path)
  
  try {
    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const range = request.headers.get('range')
    const ext = path.extname(filePath).toLowerCase()
    
    let contentType = 'application/octet-stream'
    if (ext === '.mp4') contentType = 'video/mp4'
    else if (ext === '.webm') contentType = 'video/webm'
    else if (ext === '.webp') contentType = 'image/webp'
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    else if (ext === '.png') contentType = 'image/png'

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = (end - start) + 1
      
      const fileStream = fs.createReadStream(filePath, { start, end })
      const webStream = Readable.toWeb(fileStream)
      
      return new NextResponse(webStream as any, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': contentType,
        },
      })
    } else {
      const fileStream = fs.createReadStream(filePath)
      const webStream = Readable.toWeb(fileStream)
      
      return new NextResponse(webStream as any, {
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': contentType,
        },
      })
    }
  } catch (e) {
    return new NextResponse('Not Found', { status: 404 })
  }
}

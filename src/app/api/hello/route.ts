import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Hello from the API!',
    timestamp: new Date().toISOString(),
    info: 'This is a Next.js API route. Try making a POST request to see different behavior.'
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      message: 'Data received successfully',
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    )
  }
}

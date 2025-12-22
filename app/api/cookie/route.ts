import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { theme } = await req.json()
  const res = NextResponse.json({ ok: true })
  res.cookies.set('theme', theme, {
    path: '/',
    httpOnly: true,
    maxAge: 2 ** 25
  })
  return res
}

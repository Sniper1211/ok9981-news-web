import { NextResponse } from 'next/server'
import newsData from '@/data/news.json'

export async function GET() {
  return NextResponse.json(newsData)
}
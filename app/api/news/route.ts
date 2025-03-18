import { NextResponse } from 'next/server'
import newsData from '@/data/news.json'

export const dynamic = 'force-static' // 添加此行强制静态生成

export async function GET() {
    return NextResponse.json([
    {
        id: 1,
        title: "静态示例新闻",
        content: "这是构建时生成的静态数据...",
        date: "2024-06-30"
    }
    ])
}
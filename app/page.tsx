async function getNews() {
  // 动态判断环境
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://news.ok9981.com'

  const res = await fetch(`${baseUrl}/api/news`)
  return res.json()
}
export default async function Home() {
  const news = await getNews()
  // 生产环境禁用服务端数据获取
  if (process.env.NODE_ENV === 'production') {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 border-b pb-4">
        {new Date().toLocaleDateString()} 最新新闻
      </h1>
      
      <div className="space-y-4">
        {news.map((item: any) => (
          <div key={item.id} className="p-4 border rounded-lg hover:shadow-md">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="text-gray-600 mt-2">{item.content}</p>
            <div className="text-sm text-gray-400 mt-2">{item.date}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
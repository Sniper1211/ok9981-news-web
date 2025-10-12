export type NewsItem = {
  slug: string;
  title: string;
  date: string; // ISO string
  summary: string;
  content: string;
};

export const newsItems: NewsItem[] = [
  {
    slug: "2025-04-29-daily-news",
    title: "【每日资讯简报】4月29日 周二",
    date: "2025-04-15T09:00:00+08:00",
    summary:
      "“五一”假期全国大部适宜外出，北方地区多冷空气，后期江南华南降雨明显；",
    content:
      "【每日资讯简报，一分钟知天下事】早上好！2025年4月29日 星期二 农历四月初二\n1、“五一”假期全国大部适宜外出，北方地区多冷空气，后期江南华南降雨明显；\n2、4月30日9-11时，将迎来本年度首个“蛇年蛇月蛇日蛇时”；\n3、发改委：将建立实施育儿补贴制度；指导限购城市定向增发购车指标；\n4、工信部：加快自动驾驶系统安全要求强制性国家标准研制；\n5、网警：“银狐”木马病毒来袭，文件名称与“所得税”“放假安排”等诱饵主题相关；\n6、上海6月起施行灵活就业人员公积金新政：不限户籍、提取自由，最低月缴存270元；",
  },
];

export function getAllNews() {
  // sort by date desc
  return [...newsItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getNewsBySlug(slug: string) {
  return newsItems.find((n) => n.slug === slug) || null;
}
// lib/youtube.ts

export interface YoutubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: { medium: { url: string } };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export interface ParsedVideo {
  videoId: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  subscriberCount: number;
  youtubeUrl: string;
}

export function parseVideoSignals(
  item: YoutubeVideoItem,
  subscriberCount: number
): ParsedVideo {
  return {
    videoId: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    channelId: item.snippet.channelId,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    thumbnailUrl: item.snippet.thumbnails.medium.url,
    viewCount: parseInt(item.statistics.viewCount ?? '0', 10) || 0,
    likeCount: parseInt(item.statistics.likeCount ?? '0', 10) || 0,
    commentCount: parseInt(item.statistics.commentCount ?? '0', 10) || 0,
    subscriberCount,
    youtubeUrl: `https://www.youtube.com/watch?v=${item.id}`,
  };
}

const SEARCH_KEYWORDS = [
  'AI 월수익',
  '코인봇 자동매매',
  '무자본 자동화 수익',
  'AI 자동화 부업',
  '크립토 자동매매 봇',
];

export async function searchSuspiciousVideos(apiKey: string): Promise<YoutubeVideoItem[]> {
  const results: YoutubeVideoItem[] = [];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  for (const keyword of SEARCH_KEYWORDS) {
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('q', keyword);
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('maxResults', '5');
    searchUrl.searchParams.set('publishedAfter', sevenDaysAgo);
    searchUrl.searchParams.set('regionCode', 'KR');
    searchUrl.searchParams.set('relevanceLanguage', 'ko');
    searchUrl.searchParams.set('key', apiKey);

    const res = await fetch(searchUrl.toString());
    if (!res.ok) continue;

    const data = await res.json();
    const videoIds = (data.items ?? [])
      .map((item: { id: { videoId: string } }) => item.id.videoId)
      .join(',');
    if (!videoIds) continue;

    const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    statsUrl.searchParams.set('part', 'snippet,statistics');
    statsUrl.searchParams.set('id', videoIds);
    statsUrl.searchParams.set('key', apiKey);

    const statsRes = await fetch(statsUrl.toString());
    if (!statsRes.ok) continue;

    const statsData = await statsRes.json();
    results.push(...(statsData.items ?? []));
  }

  // 중복 제거
  const seen = new Set<string>();
  return results.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export async function getChannelSubscriberCount(
  apiKey: string,
  channelId: string
): Promise<number> {
  const url = new URL('https://www.googleapis.com/youtube/v3/channels');
  url.searchParams.set('part', 'statistics');
  url.searchParams.set('id', channelId);
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) return 0;

  const data = await res.json();
  return parseInt(data.items?.[0]?.statistics?.subscriberCount ?? '0', 10) || 0;
}

// tests/lib/youtube.test.ts
import { describe, it, expect } from 'vitest';
import { parseVideoSignals } from '../../lib/youtube';
import type { YoutubeVideoItem } from '../../lib/youtube';

const mockItem: YoutubeVideoItem = {
  id: 'abc123',
  snippet: {
    title: '코인봇으로 월수익 500만원 달성',
    description: '자동매매 봇으로 누구나 쉽게 수익',
    channelId: 'ch001',
    channelTitle: '테스트채널',
    publishedAt: '2024-01-01T00:00:00Z',
    thumbnails: { medium: { url: 'https://i.ytimg.com/vi/abc123/mqdefault.jpg' } },
  },
  statistics: {
    viewCount: '100000',
    likeCount: '200',
    commentCount: '5000',
  },
};

describe('parseVideoSignals', () => {
  it('YoutubeVideoItem을 ParsedVideo로 변환한다', () => {
    const parsed = parseVideoSignals(mockItem, 1000);
    expect(parsed.videoId).toBe('abc123');
    expect(parsed.title).toBe('코인봇으로 월수익 500만원 달성');
    expect(parsed.viewCount).toBe(100000);
    expect(parsed.likeCount).toBe(200);
    expect(parsed.commentCount).toBe(5000);
    expect(parsed.subscriberCount).toBe(1000);
    expect(parsed.youtubeUrl).toBe('https://www.youtube.com/watch?v=abc123');
  });

  it('통계값이 없으면 0으로 처리한다', () => {
    const itemWithoutStats: YoutubeVideoItem = {
      ...mockItem,
      statistics: { viewCount: '', likeCount: '', commentCount: '' },
    };
    const parsed = parseVideoSignals(itemWithoutStats, 0);
    expect(parsed.viewCount).toBe(0);
    expect(parsed.likeCount).toBe(0);
    expect(parsed.commentCount).toBe(0);
  });

  it('youtubeUrl이 올바른 형식이다', () => {
    const parsed = parseVideoSignals(mockItem, 500);
    expect(parsed.youtubeUrl).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
  });
});

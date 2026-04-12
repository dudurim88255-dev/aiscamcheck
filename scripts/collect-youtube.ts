// scripts/collect-youtube.ts
import { searchSuspiciousVideos, getChannelSubscriberCount, parseVideoSignals, ParsedVideo } from '../lib/youtube';
import { calculateRiskScore, classifyVerdict } from '../lib/risk-score';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const SCORE_THRESHOLD = 50;

export interface ScoredVideo extends ParsedVideo {
  riskScore: number;
  verdict: 'scam' | 'misleading' | 'normal';
}

async function main() {
  console.log('YouTube 수집 시작...');

  const rawVideos = await searchSuspiciousVideos(YOUTUBE_API_KEY);
  console.log(`수집된 영상: ${rawVideos.length}개`);

  const scored: ScoredVideo[] = [];

  for (const item of rawVideos) {
    const subscriberCount = await getChannelSubscriberCount(YOUTUBE_API_KEY, item.snippet.channelId);
    const parsed = parseVideoSignals(item, subscriberCount);
    const riskScore = calculateRiskScore(parsed);
    const verdict = classifyVerdict(riskScore);

    console.log(`[${riskScore}점] ${parsed.title}`);

    if (riskScore >= SCORE_THRESHOLD) {
      scored.push({ ...parsed, riskScore, verdict });
    }
  }

  console.log(`기준치(${SCORE_THRESHOLD}점) 이상: ${scored.length}개`);

  // JSON으로 stdout 출력 (다음 스크립트가 읽음)
  console.log('SCORED_VIDEOS:' + JSON.stringify(scored));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

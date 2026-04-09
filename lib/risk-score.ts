// lib/risk-score.ts
// 스캠/사기성 영상 판별에 자주 등장하는 위험 키워드 목록
const DANGER_KEYWORDS = [
  '무자본', '월수익', '자동화수익', '코인봇', '자동매매',
  '수익인증', '월1000만', '월500만', '하루수익', '누구나',
  '쉽게', '지금바로', '비밀', '검증', '보장',
];

export interface VideoSignals {
  title: string;
  description: string;
  viewCount: number;
  subscriberCount: number;
  likeCount: number;
  commentCount: number;
}

export function calculateRiskScore(signals: VideoSignals): number {
  const text = `${signals.title} ${signals.description}`.toLowerCase();
  const matchedKeywords = DANGER_KEYWORDS.filter((kw) => text.includes(kw));
  const keywordScore = Math.min(matchedKeywords.length * 8, 40);

  const viewRatio =
    signals.subscriberCount > 0 ? signals.viewCount / signals.subscriberCount : 0;
  const viewScore = Math.min(
    viewRatio > 50 ? 30 : viewRatio > 20 ? 20 : viewRatio > 10 ? 10 : 0,
    30,
  );

  const likeRatio =
    signals.viewCount > 0 ? signals.likeCount / signals.viewCount : 0;
  const likeScore = likeRatio < 0.005 ? 15 : likeRatio < 0.01 ? 8 : 0;

  const commentRatio =
    signals.likeCount > 0 ? signals.commentCount / signals.likeCount : 0;
  const commentScore = commentRatio > 20 ? 15 : commentRatio > 10 ? 8 : 0;

  return Math.min(
    Math.max(Math.round(keywordScore + viewScore + likeScore + commentScore), 0),
    100,
  );
}

export type Verdict = 'scam' | 'misleading' | 'normal';

export function classifyVerdict(score: number): Verdict {
  if (score >= 80) return 'scam';
  if (score >= 50) return 'misleading';
  return 'normal';
}

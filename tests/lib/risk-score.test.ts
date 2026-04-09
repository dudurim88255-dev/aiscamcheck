// tests/lib/risk-score.test.ts
import { describe, it, expect } from 'vitest';
import { calculateRiskScore, classifyVerdict } from '../../lib/risk-score';
import type { VideoSignals } from '../../lib/risk-score';

const baseSignals: VideoSignals = {
  title: '안전한 영상 제목',
  description: '일반적인 설명',
  viewCount: 1000,
  subscriberCount: 10000,
  likeCount: 100,
  commentCount: 50,
};

describe('calculateRiskScore', () => {
  it('위험 키워드가 없으면 낮은 점수를 반환한다', () => {
    const score = calculateRiskScore(baseSignals);
    expect(score).toBeLessThan(30);
  });

  it('위험 키워드가 많으면 높은 점수를 반환한다', () => {
    const signals: VideoSignals = {
      ...baseSignals,
      title: '무자본 월수익 1000만원 자동화수익 보장 누구나 쉽게',
    };
    const score = calculateRiskScore(signals);
    expect(score).toBeGreaterThan(30);
  });

  it('점수는 0~100 범위를 벗어나지 않는다', () => {
    const highRiskSignals: VideoSignals = {
      title: '무자본 월수익 코인봇 자동매매 수익인증 월1000만 하루수익 비밀 보장 누구나 쉽게 지금바로',
      description: '검증된 자동화수익 월500만 보장',
      viewCount: 1000000,
      subscriberCount: 1000,
      likeCount: 10,
      commentCount: 500,
    };
    const score = calculateRiskScore(highRiskSignals);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('조회수/구독자 비율이 높으면 점수가 올라간다', () => {
    const viralSignals: VideoSignals = {
      ...baseSignals,
      viewCount: 500000,
      subscriberCount: 1000,
    };
    const normalScore = calculateRiskScore(baseSignals);
    const viralScore = calculateRiskScore(viralSignals);
    expect(viralScore).toBeGreaterThan(normalScore);
  });
});

describe('classifyVerdict', () => {
  it('80점 이상은 scam으로 분류한다', () => {
    expect(classifyVerdict(80)).toBe('scam');
    expect(classifyVerdict(100)).toBe('scam');
  });

  it('50~79점은 misleading으로 분류한다', () => {
    expect(classifyVerdict(50)).toBe('misleading');
    expect(classifyVerdict(79)).toBe('misleading');
  });

  it('49점 이하는 normal로 분류한다', () => {
    expect(classifyVerdict(0)).toBe('normal');
    expect(classifyVerdict(49)).toBe('normal');
  });
});

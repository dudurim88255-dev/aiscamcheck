// scripts/collect-and-generate.ts
// PR 생성 없이 posts/ 에 직접 커밋용 파일 작성
import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import type { ScoredVideo } from './collect-youtube';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^가-힣a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

async function generateDraft(video: ScoredVideo): Promise<string> {
  const prompt = `당신은 크립토·AI 수익화 사기를 분석하는 전문 팩트체커입니다.

다음 유튜브 영상을 분석해서 팩트체크 글을 한국어로 작성해주세요.

**영상 정보:**
- 제목: ${video.title}
- 채널: ${video.channelTitle}
- 조회수: ${video.viewCount.toLocaleString()}
- 구독자: ${video.subscriberCount.toLocaleString()}
- 좋아요: ${video.likeCount.toLocaleString()}
- 댓글: ${video.commentCount.toLocaleString()}
- 위험도 점수: ${video.riskScore}/100
- URL: ${video.youtubeUrl}

**작성 형식 (마크다운):**

## 영상 개요
[영상에서 주장하는 내용 2~3문장 요약]

## 위험 신호 분석
[구체적인 위험 신호 3~5가지를 체크리스트 형태로]
- [ ] 비현실적 수익 약속
- [ ] 구체적 근거 없음
- [ ] 추천 링크/수수료 구조
- [ ] 통계 수치 과장
- [ ] 재현 불가능한 성과

## 상세 분석
[각 주장의 기술적 실현 가능성, 통계 신뢰성 등 300자 이상 분석]

## 결론
[종합 판정 한 문장: "사기 가능성 높음 / 과장 광고 / 정상" 중 하나로 시작]

주의: 특정 개인을 비방하지 말고 콘텐츠의 주장에만 집중하세요.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  return (message.content[0] as { text: string }).text;
}

function buildMdx(video: ScoredVideo, body: string): string {
  const date = new Date().toISOString().split('T')[0];
  const category = video.verdict === 'scam' ? 'crypto-bot' : 'ai-income';

  return `---
title: "${video.title.replace(/"/g, '\\"')}"
date: "${date}"
category: "${category}"
riskScore: ${video.riskScore}
verdict: "${video.verdict}"
youtubeUrl: "${video.youtubeUrl}"
channelTitle: "${video.channelTitle}"
thumbnailUrl: "${video.thumbnailUrl}"
aiGenerated: true
---

> **분석 안내:** 이 글은 AI가 자동으로 작성했습니다.

<RiskGauge score={${video.riskScore}} />

<VerdictBadge verdict="${video.verdict}" />

${body}

{/* 체크리스트는 Claude가 마크다운 본문에 포함해서 생성 */}

---

**원본 영상:** [${video.channelTitle} - YouTube](${video.youtubeUrl})
`;
}

async function main() {
  // collect-youtube.ts 실행 후 출력에서 SCORED_VIDEOS 파싱
  const output = execSync('npx tsx scripts/collect-youtube.ts', { encoding: 'utf8' });
  const match = output.match(/SCORED_VIDEOS:(.+)/);
  if (!match) {
    console.log('분석 대상 영상 없음');
    return;
  }

  const videos: ScoredVideo[] = JSON.parse(match[1]);
  console.log(`포스트 생성 대상: ${videos.length}개`);

  // posts/ 디렉토리 보장
  const postsDir = join(process.cwd(), 'posts');
  if (!existsSync(postsDir)) {
    mkdirSync(postsDir, { recursive: true });
  }

  let created = 0;
  for (const video of videos.slice(0, 3)) { // 하루 최대 3개
    const date = new Date().toISOString().split('T')[0];
    const slug = slugify(video.title);
    const filename = `${date}-${slug}.mdx`;
    const filePath = join(postsDir, filename);

    // 같은 날 이미 생성된 파일이면 스킵
    if (existsSync(filePath)) {
      console.log(`이미 존재: ${filename}`);
      continue;
    }

    console.log(`포스트 생성 중: ${video.title}`);
    const body = await generateDraft(video);
    const mdx = buildMdx(video, body);

    writeFileSync(filePath, mdx, 'utf8');
    console.log(`저장됨: ${filename}`);
    created++;

    // API 레이트 리밋 방지
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`완료: ${created}개 포스트 생성`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

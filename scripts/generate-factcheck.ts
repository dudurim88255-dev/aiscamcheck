// scripts/generate-factcheck.ts
import Anthropic from '@anthropic-ai/sdk';
import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';
import type { ScoredVideo } from './collect-youtube';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN! });

const OWNER = process.env.GITHUB_REPO_OWNER!;
const REPO = process.env.GITHUB_REPO_NAME!;

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

> **분석 안내:** 이 글은 AI가 초안을 작성하고 편집자가 검토·발행했습니다.

<RiskGauge score={${video.riskScore}} />

<VerdictBadge verdict="${video.verdict}" />

${body}

{/* 체크리스트는 Claude가 마크다운 본문에 포함해서 생성 */}

---

**원본 영상:** [${video.channelTitle} - YouTube](${video.youtubeUrl})
`;
}

async function createPR(slug: string, mdxContent: string, video: ScoredVideo) {
  const branch = `draft/${slug}-${Date.now()}`;
  const filePath = `posts/${slug}.mdx`;

  // 현재 main 브랜치의 SHA 가져오기
  const { data: ref } = await octokit.git.getRef({ owner: OWNER, repo: REPO, ref: 'heads/main' });
  const sha = ref.object.sha;

  // 새 브랜치 생성
  await octokit.git.createRef({
    owner: OWNER,
    repo: REPO,
    ref: `refs/heads/${branch}`,
    sha,
  });

  // 파일 커밋
  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: filePath,
    message: `draft: ${video.title}`,
    content: Buffer.from(mdxContent).toString('base64'),
    branch,
  });

  // PR 생성
  const { data: pr } = await octokit.pulls.create({
    owner: OWNER,
    repo: REPO,
    title: `[팩트체크] ${video.title}`,
    body: `## 위험도 점수: ${video.riskScore}/100\n\n**판정:** ${video.verdict}\n\n**영상:** ${video.youtubeUrl}\n\n---\n\n내용 확인 후 Merge하면 자동 발행됩니다.`,
    head: branch,
    base: 'main',
  });

  console.log(`PR 생성됨: ${pr.html_url}`);
}

async function main() {
  // collect-youtube.ts 실행 후 출력에서 SCORED_VIDEOS 파싱
  const output = execSync('tsx scripts/collect-youtube.ts', { encoding: 'utf8' });
  const match = output.match(/SCORED_VIDEOS:(.+)/);
  if (!match) {
    console.log('분석 대상 영상 없음');
    return;
  }

  const videos: ScoredVideo[] = JSON.parse(match[1]);
  console.log(`초안 생성 대상: ${videos.length}개`);

  for (const video of videos.slice(0, 3)) { // 하루 최대 3개
    const slug = slugify(video.title);
    console.log(`초안 생성 중: ${video.title}`);

    const body = await generateDraft(video);
    const mdx = buildMdx(video, body);
    await createPR(slug, mdx, video);

    // API 레이트 리밋 방지
    await new Promise((r) => setTimeout(r, 2000));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

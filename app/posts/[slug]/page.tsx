import { getScamPostBySlug, getAllScamPosts } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import RiskGauge from '@/components/RiskGauge';
import VerdictBadge from '@/components/VerdictBadge';
import CheckList from '@/components/CheckList';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const components = { RiskGauge, VerdictBadge, CheckList };

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllScamPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getScamPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: `위험도 ${post.frontmatter.riskScore}/100 · ${post.frontmatter.channelTitle} 팩트체크`,
  };
}

const VERDICT_LABEL: Record<string, string> = {
  scam: '사기 가능성 높음',
  misleading: '과장 광고',
  normal: '정상',
};

const VERDICT_STYLE: Record<string, { color: string; bg: string }> = {
  scam:       { color: '#e8341a', bg: 'rgba(232,52,26,0.10)' },
  misleading: { color: '#f5a623', bg: 'rgba(245,166,35,0.10)' },
  normal:     { color: '#2dbd6e', bg: 'rgba(45,189,110,0.10)' },
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getScamPostBySlug(slug);
  if (!post) notFound();

  const { title, date, channelTitle, riskScore, verdict, aiGenerated } = post.frontmatter;
  const vs = VERDICT_STYLE[verdict] ?? VERDICT_STYLE.normal;
  const verdictLabel = VERDICT_LABEL[verdict] ?? verdict;

  const scoreColor = riskScore >= 90
    ? '#e8341a'
    : riskScore >= 60
      ? '#f5a623'
      : '#2dbd6e';

  return (
    <article style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(16px, 5vw, 64px)' }}>
      {/* 브레드크럼 */}
      <nav
        className="section-label"
        style={{ marginBottom: 32 }}
      >
        <Link href="/" style={{ color: 'var(--sc-accent)', textDecoration: 'none' }}>홈</Link>
        <span style={{ margin: '0 8px', color: 'var(--sc-border-strong)' }}>/</span>
        <span>{channelTitle}</span>
      </nav>

      <hr className="editorial-rule" style={{ marginBottom: 32 }} />

      {/* 헤더 */}
      <header style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontFamily: 'var(--sc-font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--sc-text-primary)',
            marginBottom: 16,
          }}
        >
          {title}
        </h1>

        {/* 메타 — BASIC Agency: [채널] · [날짜] */}
        <p className="section-label" style={{ marginBottom: 24 }}>
          {channelTitle} · {date}
        </p>

        {/* 위험도 카드 — 점수가 핵심 정보 */}
        <div
          className="card"
          style={{
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>위험도 점수</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span
                className="tabular-nums"
                style={{
                  fontFamily: 'var(--sc-font-display)',
                  fontSize: '5rem',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: scoreColor,
                  letterSpacing: '-0.04em',
                }}
              >
                {riskScore}
              </span>
              <span style={{ color: 'var(--sc-text-muted)', fontSize: '0.85rem' }}>/100</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p className="section-label" style={{ marginBottom: 8 }}>최종 판정</p>
            <span
              style={{
                display: 'inline-block',
                color: vs.color,
                background: vs.bg,
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                padding: '6px 14px',
                borderRadius: 4,
              }}
            >
              {verdictLabel}
            </span>
          </div>
        </div>
      </header>

      <hr className="editorial-rule" style={{ marginBottom: 40 }} />

      {/* 본문 */}
      <div className="prose">
        <MDXRemote source={post.content} components={components} />
      </div>

      {aiGenerated && (
        <p
          style={{
            marginTop: 48,
            paddingTop: 20,
            fontSize: '0.78rem',
            color: 'var(--sc-text-muted)',
            borderTop: '1px solid var(--sc-border)',
            letterSpacing: '0.02em',
          }}
        >
          이 글은 AI가 초안을 작성하고 편집자가 검토·발행했습니다.
        </p>
      )}
    </article>
  );
}

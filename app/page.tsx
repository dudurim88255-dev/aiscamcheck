import { getAllScamPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export default async function Home() {
  const posts = (await Promise.resolve(getAllScamPosts())).sort(
    (a, b) => b.frontmatter.riskScore - a.frontmatter.riskScore
  );

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(16px, 5vw, 64px)' }}>
      {/* BASIC Agency 스타일 히어로 — horizontal rule + editorial typography */}
      <hr className="editorial-rule" style={{ marginBottom: 32 }} />

      <header style={{ marginBottom: 48 }}>
        <div className="flex items-start gap-8">
          {/* 좌측: 섹션 라벨 */}
          <div className="section-label" style={{ paddingTop: 6, minWidth: 80 }}>
            팩트체크
          </div>

          {/* 우측: 제목 + 설명 */}
          <div>
            <h1
              className="display"
              style={{
                fontFamily: 'var(--sc-font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: 'var(--sc-text-primary)',
                marginBottom: 16,
              }}
            >
              AI·크립토 수익화 영상,<br />직접 검증했습니다
            </h1>
            <p style={{ color: 'var(--sc-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              과장 광고와 사기를 구분하는 독립 팩트체크 미디어
            </p>
          </div>
        </div>
      </header>

      <hr className="editorial-rule" style={{ marginBottom: 32 }} />

      {/* 위험도 범례 */}
      <div
        className="flex items-center gap-5 mb-8"
        style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sc-text-muted)' }}
      >
        <span className="flex items-center gap-1.5">
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--risk-high)', display: 'inline-block' }} />
          사기 (90+)
        </span>
        <span className="flex items-center gap-1.5">
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--risk-mid)', display: 'inline-block' }} />
          과장 (60–89)
        </span>
        <span className="flex items-center gap-1.5">
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--risk-low)', display: 'inline-block' }} />
          정상 (0–59)
        </span>
      </div>

      {/* 포스트 목록 */}
      {posts.length === 0 ? (
        <p style={{ color: 'var(--sc-text-muted)', textAlign: 'center', padding: '3rem 0' }}>
          검증된 콘텐츠가 없습니다.
        </p>
      ) : (
        <div className="grid gap-3">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      )}

      <hr className="editorial-rule" style={{ marginTop: 64 }} />
    </main>
  );
}

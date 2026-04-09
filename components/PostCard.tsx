import Link from 'next/link';
import { PostMeta, Post } from '@/lib/posts';

const POST_TYPE_LABELS: Record<string, string> = {
  NEW_TOOL_REVIEW: '신규 리뷰',
  VS_COMPARISON: 'VS 비교',
  PRICING_GUIDE: '가격 가이드',
  UPDATE_SUMMARY: '업데이트',
  HOW_TO_GUIDE: '활용법',
};

const POST_TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  NEW_TOOL_REVIEW: { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  VS_COMPARISON:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  PRICING_GUIDE:   { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  UPDATE_SUMMARY:  { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  HOW_TO_GUIDE:    { color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
};

const VERDICT_COLORS: Record<string, { color: string; bg: string }> = {
  scam:       { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  misleading: { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  normal:     { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

const VERDICT_LABELS: Record<string, string> = {
  scam: '사기',
  misleading: '과장',
  normal: '정상',
};

// PostMeta (레거시 aiscout 포스트) 타입 가드
function isPostMeta(post: PostMeta | Post): post is PostMeta {
  return 'postType' in post;
}

export function PostCard({ post }: { post: PostMeta | Post }) {
  // 레거시 aiscout 포스트
  if (isPostMeta(post)) {
    const type = POST_TYPE_COLORS[post.postType] ?? POST_TYPE_COLORS.HOW_TO_GUIDE;
    const typeLabel = POST_TYPE_LABELS[post.postType] ?? post.postType;
    return (
      <Link href={`/blog/${post.slug}`} className="block group">
        <article
          className="glass-card h-full overflow-hidden group-hover:-translate-y-1"
          style={{ borderRadius: 16, transition: 'border-color 0.2s, transform 0.2s' }}
        >
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span style={{
                background: type.bg, color: type.color,
                border: `1px solid ${type.color}40`,
                borderRadius: 20, padding: '2px 10px', fontSize: 12,
              }}>
                {typeLabel}
              </span>
              {post.category && (
                <span style={{
                  background: 'rgba(245,158,11,0.08)', color: 'var(--accent-amber)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: 20, padding: '2px 10px', fontSize: 12,
                }}>
                  {post.category}
                </span>
              )}
            </div>
            <h2 className="font-bold text-base mb-2 leading-snug" style={{ color: 'var(--text-primary)' }}>
              {post.title}
            </h2>
            <p className="text-sm line-clamp-3 mb-4" style={{ color: 'var(--text-secondary)' }}>
              {post.summary}
            </p>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {post.lastUpdated}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // 스캠체크 포스트 (Post 타입)
  const { frontmatter, slug } = post;
  const verdict = VERDICT_COLORS[frontmatter.verdict] ?? VERDICT_COLORS.normal;
  const verdictLabel = VERDICT_LABELS[frontmatter.verdict] ?? frontmatter.verdict;
  const riskScore = frontmatter.riskScore;

  return (
    <Link href={`/posts/${slug}`} className="block group">
      <article
        className="glass-card h-full overflow-hidden group-hover:-translate-y-1"
        style={{ borderRadius: 16, transition: 'border-color 0.2s, transform 0.2s' }}
      >
        <div className="p-5">
          {/* 판정 + 카테고리 배지 */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span style={{
              background: verdict.bg, color: verdict.color,
              border: `1px solid ${verdict.color}40`,
              borderRadius: 20, padding: '2px 10px', fontSize: 12,
            }}>
              {verdictLabel}
            </span>
            {frontmatter.category && (
              <span style={{
                background: 'rgba(245,158,11,0.08)', color: 'var(--accent-amber)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 20, padding: '2px 10px', fontSize: 12,
              }}>
                {frontmatter.category}
              </span>
            )}
            {/* 위험도 점수 */}
            <span style={{
              background: riskScore >= 80 ? 'rgba(239,68,68,0.1)' : riskScore >= 50 ? 'rgba(249,115,22,0.1)' : 'rgba(16,185,129,0.1)',
              color: riskScore >= 80 ? '#ef4444' : riskScore >= 50 ? '#f97316' : '#10b981',
              border: `1px solid ${riskScore >= 80 ? 'rgba(239,68,68,0.3)' : riskScore >= 50 ? 'rgba(249,115,22,0.3)' : 'rgba(16,185,129,0.3)'}`,
              borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600,
            }}>
              위험도 {riskScore}
            </span>
          </div>

          {/* 채널명 */}
          {frontmatter.channelTitle && (
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              {frontmatter.channelTitle}
            </div>
          )}

          {/* 제목 */}
          <h2 className="font-bold text-base mb-4 leading-snug" style={{ color: 'var(--text-primary)' }}>
            {frontmatter.title}
          </h2>

          {/* 날짜 */}
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {frontmatter.date}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default PostCard;

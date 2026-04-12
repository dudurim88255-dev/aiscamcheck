"use client";

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import type { Post } from '@/lib/posts';

// MOTION.md §10: aiscamcheck — ×1.2 duration, hover y -3px, spring easing 금지(진중함)
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const VERDICT_STYLE: Record<string, { color: string; bg: string }> = {
  scam:       { color: '#e8341a', bg: 'rgba(232,52,26,0.10)' },
  misleading: { color: '#f5a623', bg: 'rgba(245,166,35,0.10)' },
  normal:     { color: '#2dbd6e', bg: 'rgba(45,189,110,0.10)' },
};

const VERDICT_LABEL: Record<string, string> = {
  scam: '사기 가능성 높음',
  misleading: '과장 광고',
  normal: '정상',
};

export default function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const shouldReduce = useReducedMotion();
  const { title, date, riskScore, verdict, channelTitle } = post.frontmatter;
  const vs = VERDICT_STYLE[verdict] ?? VERDICT_STYLE.normal;
  const verdictLabel = VERDICT_LABEL[verdict] ?? verdict;

  // 위험도 점수 색상
  const scoreColor = riskScore >= 90
    ? '#e8341a'
    : riskScore >= 60
      ? '#f5a623'
      : '#2dbd6e';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{
        // ×1.2 duration: 0.32 × 1.2 = 0.384s
        duration: shouldReduce ? 0 : 0.38,
        ease: EASE_OUT,
        // stagger 96ms (80ms × 1.2)
        delay: shouldReduce ? 0 : index * 0.096,
      }}
      // spring 금지 — ease.out만 사용 (MOTION.md §10 aiscamcheck)
      whileHover={{ y: shouldReduce ? 0 : -3 }}
    >
      <Link href={`/posts/${post.slug}`}>
        <article
          className="card p-5"
          style={{
            transition: 'border-color 0.38s cubic-bezier(0.16,1,0.3,1), box-shadow 0.38s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            {/* 텍스트 영역 */}
            <div className="flex-1 min-w-0">
              <h2
                className="font-semibold mb-1"
                style={{
                  color: 'var(--sc-text-primary)',
                  fontSize: '0.97rem',
                  lineHeight: 1.45,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {title}
              </h2>
              <p style={{ color: 'var(--sc-text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                {channelTitle} · {date}
              </p>
            </div>

            {/* 점수 + 뱃지 — BASIC Agency: 숫자가 핵심 정보 */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span
                className="tabular-nums"
                style={{
                  fontFamily: 'var(--sc-font-display)',
                  fontSize: '2.75rem',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: scoreColor,
                  letterSpacing: '-0.04em',
                }}
              >
                {riskScore}
              </span>
              <span
                className="text-xs whitespace-nowrap"
                style={{
                  color: vs.color,
                  background: vs.bg,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.04em',
                  padding: '3px 8px',
                  borderRadius: 4,
                }}
              >
                {verdictLabel}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

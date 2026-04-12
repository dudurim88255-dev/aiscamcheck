import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: '문의하기 | AI스캠체크',
  description: 'AI스캠체크에 제보, 오류 신고, 협업 문의를 보내주세요.',
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <article style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(16px, 5vw, 64px)' }}>
      <hr className="editorial-rule" style={{ marginBottom: 32 }} />

      <h1
        style={{
          fontFamily: 'var(--sc-font-display)',
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--sc-text-primary)',
          marginBottom: 12,
        }}
      >
        문의하기
      </h1>
      <p style={{ color: 'var(--sc-text-muted)', fontSize: '0.95rem', marginBottom: 40, lineHeight: 1.7 }}>
        사기 제보, 오류 신고, 협업 제안 등 무엇이든 환영합니다.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* 이메일 */}
        <div
          className="card"
          style={{ padding: '20px 24px' }}
        >
          <p className="section-label" style={{ marginBottom: 8 }}>이메일</p>
          <ul style={{ color: 'var(--sc-text-secondary)', fontSize: '0.9rem', lineHeight: 2 }}>
            <li>• 사기 제보·협업: <span style={{ color: 'var(--sc-accent)' }}>dudurim88255@gmail.com</span></li>
            <li>• 오류 신고: GitHub Issues로 제출</li>
          </ul>
        </div>

        {/* GitHub */}
        <div
          className="card"
          style={{ padding: '20px 24px' }}
        >
          <p className="section-label" style={{ marginBottom: 8 }}>GitHub</p>
          <p style={{ color: 'var(--sc-text-secondary)', fontSize: '0.9rem', marginBottom: 12 }}>
            오류 제보나 기능 제안은 GitHub에서 Issue를 열어주세요.
          </p>
          <a
            href="https://github.com/dudurim88255-dev/aiscamcheck/issues"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--sc-accent)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            GitHub Issues 바로가기 →
          </a>
        </div>

        {/* 안내 */}
        <div
          style={{
            padding: '14px 18px',
            background: 'rgba(232,52,26,0.05)',
            border: '1px solid rgba(232,52,26,0.15)',
            borderRadius: 6,
            color: 'var(--sc-text-muted)',
            fontSize: '0.82rem',
            lineHeight: 1.7,
          }}
        >
          광고성 스팸, 악의적 요청에는 응하지 않습니다. 합리적인 문의에는 3영업일 내 답변 드립니다.
        </div>
      </div>
    </article>
  );
}

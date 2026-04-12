import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--sc-bg-page)',
        borderTop: '1px solid var(--sc-border)',
        marginTop: 64,
        padding: '40px 0',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px, 5vw, 64px)', textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--sc-font-display)',
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--sc-text-primary)',
            marginBottom: 6,
            letterSpacing: '-0.01em',
          }}
        >
          AI스캠체크
        </p>
        <p style={{ color: 'var(--sc-text-muted)', fontSize: '0.82rem', marginBottom: 20 }}>
          AI·크립토 수익화 영상, 직접 검증했습니다
        </p>
        <div
          className="flex items-center justify-center gap-4"
          style={{ color: 'var(--sc-text-muted)', fontSize: '0.78rem', marginBottom: 20 }}
        >
          <Link href="/about" className="hover:opacity-60 transition-opacity">소개</Link>
          <span style={{ color: 'var(--sc-border-strong)' }}>·</span>
          <Link href="/privacy" className="hover:opacity-60 transition-opacity">개인정보처리방침</Link>
          <span style={{ color: 'var(--sc-border-strong)' }}>·</span>
          <Link href="/contact" className="hover:opacity-60 transition-opacity">문의</Link>
        </div>
        <p style={{ color: 'var(--sc-text-muted)', fontSize: '0.72rem', letterSpacing: '0.02em' }}>
          © 2026 AI스캠체크. 콘텐츠는 팩트체크 목적으로 제공됩니다. 투자 결정은 본인 책임입니다.
        </p>
      </div>
    </footer>
  );
}

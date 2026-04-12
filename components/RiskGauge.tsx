// components/RiskGauge.tsx
interface RiskGaugeProps {
  score: number; // 0~100
}

function getColorToken(score: number): { bar: string; text: string; label: string } {
  if (score >= 80) return { bar: '#e8341a', text: '#e8341a', label: '위험' };
  if (score >= 50) return { bar: '#f5a623', text: '#f5a623', label: '주의' };
  return { bar: '#2dbd6e', text: '#2dbd6e', label: '양호' };
}

export default function RiskGauge({ score }: RiskGaugeProps) {
  const { bar, text, label } = getColorToken(score);

  return (
    <div
      style={{
        margin: '24px 0',
        padding: '20px 24px',
        background: 'var(--sc-bg-card)',
        border: '1px solid var(--sc-border)',
        borderRadius: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sc-text-muted)' }}>
          위험도 점수
        </span>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span
            className="tabular-nums"
            style={{
              fontFamily: 'var(--sc-font-display)',
              fontSize: '2rem',
              fontWeight: 800,
              lineHeight: 1,
              color: text,
              letterSpacing: '-0.03em',
            }}
          >
            {score}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--sc-text-muted)' }}>/100</span>
        </span>
      </div>

      {/* 게이지 바 */}
      <div
        style={{
          width: '100%',
          height: 4,
          borderRadius: 2,
          background: 'var(--sc-border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: '100%',
            borderRadius: 2,
            background: bar,
            transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>

      <div style={{ marginTop: 8, textAlign: 'right' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: text }}>
          {label}
        </span>
      </div>
    </div>
  );
}

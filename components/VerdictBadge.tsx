type Verdict = 'scam' | 'misleading' | 'normal';

interface VerdictBadgeProps {
  verdict: Verdict;
}

const VERDICT_CONFIG: Record<Verdict, { label: string; bg: string; color: string; borderColor: string }> = {
  scam: {
    label: '사기 가능성 높음',
    bg: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  misleading: {
    label: '과장 광고',
    bg: 'rgba(249, 115, 22, 0.1)',
    color: '#f97316',
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  normal: {
    label: '정상',
    bg: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
};

export default function VerdictBadge({ verdict }: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict];

  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold my-4"
      style={{
        background: config.bg,
        color: config.color,
        borderColor: config.borderColor,
      }}
    >
      <span>⚠️</span>
      <span>최종 판정: {config.label}</span>
    </div>
  );
}

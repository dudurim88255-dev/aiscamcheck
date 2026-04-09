// components/RiskGauge.tsx
interface RiskGaugeProps {
  score: number; // 0~100
}

// 점수 구간에 따른 색상 키 반환 (왜: 색상 결정 로직을 UI와 분리)
function getColor(score: number): string {
  if (score >= 80) return 'red';
  if (score >= 50) return 'orange';
  return 'green';
}

const COLOR_CLASSES: Record<string, string> = {
  red: 'bg-red-500 text-red-400',
  orange: 'bg-orange-500 text-orange-400',
  green: 'bg-green-500 text-green-400',
};

const COLOR_LABELS: Record<string, string> = {
  red: '위험',
  orange: '주의',
  green: '양호',
};

export default function RiskGauge({ score }: RiskGaugeProps) {
  const color = getColor(score);
  const [bgClass, textClass] = COLOR_CLASSES[color].split(' ');
  const label = COLOR_LABELS[color];

  return (
    <div className="my-6 p-4 rounded-lg bg-bg-card border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white/60">위험도 점수</span>
        <span className={`text-2xl font-bold ${textClass}`}>
          {score}<span className="text-sm font-normal">/100</span>
        </span>
      </div>
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${bgClass}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-2 text-right">
        <span className={`text-xs font-semibold ${textClass}`}>{label}</span>
      </div>
    </div>
  );
}

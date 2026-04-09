interface CheckListProps {
  items: Array<{ label: string; checked: boolean }>;
}

export default function CheckList({ items }: CheckListProps) {
  return (
    <div className="my-6 p-4 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
        근거 체크리스트
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span style={{ color: item.checked ? '#ef4444' : '#10b981' }}>
              {item.checked ? '❌' : '✅'}
            </span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

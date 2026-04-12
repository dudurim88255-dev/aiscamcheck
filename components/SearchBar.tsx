'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Result {
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  riskScore?: number;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (query.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) { setResults([]); setOpen(false); setLoading(false); return; }
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <div
        style={{
          background: 'var(--sc-bg-surface)',
          border: '1px solid var(--sc-border)',
          borderRadius: 6,
        }}
        className="flex items-center px-3 gap-2"
      >
        <span style={{ color: 'var(--sc-text-muted)', fontSize: 13 }}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="채널명, 키워드 검색..."
          className="flex-1 bg-transparent py-2 text-sm outline-none"
          style={{ color: 'var(--sc-text-primary)' }}
        />
        {loading && <span style={{ color: 'var(--sc-text-muted)', fontSize: 11 }}>...</span>}
        {query && !loading && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            style={{ color: 'var(--sc-text-muted)', fontSize: 14, lineHeight: 1 }}
          >
            ✕
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 6,
            background: 'var(--sc-bg-card)',
            border: '1px solid var(--sc-border)',
            borderRadius: 6,
            zIndex: 100,
            maxHeight: 360,
            overflowY: 'auto',
          }}
        >
          {results.map((r) => (
            <Link
              key={r.slug}
              href={`/posts/${r.slug}`}
              onClick={() => { setOpen(false); setQuery(''); }}
              className="block px-4 py-3 transition-colors"
              style={{ borderBottom: '1px solid var(--sc-border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sc-bg-surface)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--sc-text-primary)' }}>
                {r.title}
              </p>
              <p style={{ color: 'var(--sc-text-muted)', fontSize: '0.75rem', marginTop: 2 }}>
                {r.category} · {r.date}
              </p>
            </Link>
          ))}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 6,
            background: 'var(--sc-bg-card)',
            border: '1px solid var(--sc-border)',
            borderRadius: 6,
            padding: 16,
            textAlign: 'center',
            zIndex: 100,
          }}
        >
          <p style={{ color: 'var(--sc-text-muted)', fontSize: 13 }}>검색 결과가 없습니다</p>
        </div>
      )}
    </div>
  );
}

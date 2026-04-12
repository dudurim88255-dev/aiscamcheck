'use client';
import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';

const CATEGORIES = [
  { slug: 'crypto-bot', label: '크립토 봇 사기' },
  { slug: 'ai-income', label: 'AI 수익화 과장' },
  { slug: 'nocode-scam', label: '노코드 수익화 사기' },
  { slug: 'investment-scam', label: '투자 사기' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        background: 'var(--sc-bg-page)',
        borderBottom: '1px solid var(--sc-border)',
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* SCAM 레드 마커 */}
          <span
            style={{
              background: 'var(--sc-accent)',
              color: '#f0ebe1',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '2px 6px',
              borderRadius: 2,
            }}
          >
            SCAM
          </span>
          <span
            style={{
              fontFamily: 'var(--sc-font-display)',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--sc-text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            AI스캠체크
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-sm transition-opacity hover:opacity-60"
              style={{
                color: 'var(--sc-text-muted)',
                fontSize: '0.78rem',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SearchBar />
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: 'var(--sc-text-muted)', fontSize: '1.1rem' }}
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{
            background: 'var(--sc-bg-card)',
            borderTop: '1px solid var(--sc-border)',
          }}
          className="md:hidden px-4 py-3 flex flex-col gap-3"
        >
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              style={{
                color: 'var(--sc-text-secondary)',
                fontSize: '0.85rem',
              }}
              onClick={() => setMenuOpen(false)}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

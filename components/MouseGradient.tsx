'use client';
import { useEffect, useRef } from 'react';

export default function MouseGradient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf: number;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const animate = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;

      const x = (cx / window.innerWidth) * 100;
      const y = (cy / window.innerHeight) * 100;

      // 다크 배경에서 orange-red 광원 (BASIC Agency brand color)
      el.style.background = `
        radial-gradient(600px circle at ${x}% ${y}%,
          rgba(232, 52, 26, 0.06) 0%,
          transparent 70%
        )
      `;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        transition: 'background 0.05s',
      }}
    />
  );
}

import { Metadata } from 'next';

export const SITE_NAME = 'AI스캠체크';
export const SITE_TAGLINE = 'AI·크립토 수익화 영상, 직접 검증했습니다';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiscamcheck.vercel.app';
export const SITE_DESCRIPTION = 'AI·크립토 수익화 영상의 과장 광고와 사기를 구분하는 독립 팩트체크 미디어';

/** 절대 URL이면 그대로, 상대 경로면 SITE_URL 붙임 */
function resolveImageUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url}`;
}

/** 홈/카테고리/태그 페이지용 공통 메타데이터 */
export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
    },
  };
}

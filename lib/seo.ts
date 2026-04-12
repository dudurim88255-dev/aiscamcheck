import { Metadata } from 'next';
import { PostMeta } from './posts';

export const SITE_NAME = 'AI스캠체크';
export const SITE_TAGLINE = 'AI·크립토 수익화 영상, 직접 검증했습니다';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiscamcheck.vercel.app';
export const SITE_DESCRIPTION = 'AI·크립토 수익화 영상의 과장 광고와 사기를 구분하는 독립 팩트체크 미디어';

/** 절대 URL이면 그대로, 상대 경로면 SITE_URL 붙임 */
function resolveImageUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url}`;
}

export function buildOgImageUrl(post: PostMeta): string {
  const params = new URLSearchParams({ title: post.title, category: post.category, postType: post.postType });
  return `${SITE_URL}/og?${params.toString()}`;
}

export function buildPostMetadata(post: PostMeta): Metadata {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.coverImage ? resolveImageUrl(post.coverImage) : buildOgImageUrl(post);

  const rawDesc = post.summary || post.title;
  const description = rawDesc.length > 155 ? rawDesc.slice(0, 152) + '…' : rawDesc;
  const keywords = [post.seoKeyword, ...post.tags].filter(Boolean);

  return {
    title: post.title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      locale: 'ko_KR',
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.lastUpdated ?? post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
    },
  };
}

export function buildArticleJsonLd(post: PostMeta) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.coverImage ? resolveImageUrl(post.coverImage) : buildOgImageUrl(post);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary || post.title,
    image: ogImage,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.ico`, width: 48, height: 48 },
    },
    datePublished: post.date,
    dateModified: post.lastUpdated ?? post.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: [post.seoKeyword, ...post.tags].filter(Boolean).join(', '),
    inLanguage: 'ko-KR',
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
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

import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MouseGradient from '@/components/MouseGradient';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto',
});

export const metadata: Metadata = {
  title: { default: 'AI스캠체크 — AI·크립토 사기 팩트체크', template: '%s | AI스캠체크' },
  description: 'AI·크립토 수익화 영상, 직접 검증했습니다',
  keywords: ['AI 사기', '크립토 사기', '투자 사기 팩트체크', '자동매매 봇 사기', 'AI 수익화 과장', '노코드 사기'],
  authors: [{ name: 'AI스캠체크' }],
  creator: 'AI스캠체크',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiscamcheck.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'AI스캠체크',
  },
  themeColor: '#ef4444',
  verification: { google: 'de9TSsBBneQps0DJ0It1vzBsUTeGLGOoqqjAvSsx3fI' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_ACCOUNT && (
          <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_ACCOUNT} />
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <MouseGradient />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

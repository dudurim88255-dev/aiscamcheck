export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-6">AI스캠체크란?</h1>
      <div className="prose prose-invert max-w-none">
        <p>유튜브의 크립토·AI 수익화 영상을 자동 수집하고, AI와 편집자가 협력하여 사실 여부를 검증합니다.</p>
        <h2>분석 방법론</h2>
        <ul>
          <li><strong>키워드 분석</strong>: 위험 키워드 포함 여부 및 빈도</li>
          <li><strong>채널 신호</strong>: 구독자 대비 조회수 이상치</li>
          <li><strong>참여율 분석</strong>: 좋아요/댓글 비율 패턴</li>
          <li><strong>주장 검증</strong>: 수익 주장의 기술적 실현 가능성</li>
        </ul>
        <h2>광고 안내</h2>
        <p>이 사이트는 Google AdSense 및 스폰서 광고를 포함합니다. 스폰서 콘텐츠는 명시적으로 표시됩니다.</p>
      </div>
    </main>
  );
}

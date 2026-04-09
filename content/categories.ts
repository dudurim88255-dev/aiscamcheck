// content/categories.ts
export const CATEGORIES = {
  'crypto-bot': {
    label: '크립토 봇 사기',
    description: '자동매매 봇 과장 광고 및 사기',
    color: 'red',
  },
  'ai-income': {
    label: 'AI 수익화 과장',
    description: 'AI 도구를 이용한 수익화 과장 광고',
    color: 'orange',
  },
  'nocode-scam': {
    label: '노코드 수익화 사기',
    description: '노코드 도구로 손쉽게 돈 번다는 사기',
    color: 'yellow',
  },
  'investment-scam': {
    label: '투자 사기',
    description: '크립토·AI 투자 사기',
    color: 'red',
  },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;

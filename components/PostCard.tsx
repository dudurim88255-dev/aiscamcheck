import Link from 'next/link';
import type { Post } from '@/lib/posts';

const VERDICT_STYLE = {
  scam: 'text-red-400 bg-red-500/10',
  misleading: 'text-orange-400 bg-orange-500/10',
  normal: 'text-green-400 bg-green-500/10',
};

const VERDICT_LABEL = {
  scam: '사기 가능성 높음',
  misleading: '과장 광고',
  normal: '정상',
};

export default function PostCard({ post }: { post: Post }) {
  const { title, date, riskScore, verdict, channelTitle } = post.frontmatter;
  const verdictStyle = VERDICT_STYLE[verdict];
  const verdictLabel = VERDICT_LABEL[verdict];

  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="p-5 rounded-xl bg-bg-card border border-white/10 hover:border-accent/40 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold truncate">{title}</h2>
            <p className="text-white/40 text-sm mt-1">{channelTitle} · {date}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-2xl font-bold text-accent">{riskScore}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${verdictStyle}`}>
              {verdictLabel}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

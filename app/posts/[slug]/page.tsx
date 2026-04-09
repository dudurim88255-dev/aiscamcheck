import { getScamPostBySlug, getAllScamPosts } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import RiskGauge from '@/components/RiskGauge';
import VerdictBadge from '@/components/VerdictBadge';
import CheckList from '@/components/CheckList';
import { notFound } from 'next/navigation';

const components = { RiskGauge, VerdictBadge, CheckList };

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllScamPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getScamPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-4">{post.frontmatter.title}</h1>
      <p className="text-white/40 text-sm mb-8">
        {post.frontmatter.date} · {post.frontmatter.channelTitle}
      </p>
      <MDXRemote source={post.content} components={components} />
      {post.frontmatter.aiGenerated && (
        <p className="mt-8 text-xs text-white/30 border-t border-white/10 pt-4">
          이 글은 AI가 초안을 작성하고 편집자가 검토·발행했습니다.
        </p>
      )}
    </article>
  );
}

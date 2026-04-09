import { getAllScamPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export default async function Home() {
  const posts = (await Promise.resolve(getAllScamPosts())).sort(
    (a, b) => b.frontmatter.riskScore - a.frontmatter.riskScore
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">AI스캠체크</h1>
      <p className="text-white/60 mb-10">AI·크립토 수익화 영상, 직접 검증했습니다</p>
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}

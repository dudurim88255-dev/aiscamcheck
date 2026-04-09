import { getAllScamPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import { CATEGORIES, CategorySlug } from '@/content/categories';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ category: slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryInfo = CATEGORIES[category as CategorySlug];
  if (!categoryInfo) notFound();

  const posts = (await Promise.resolve(getAllScamPosts()))
    .filter((p) => p.frontmatter.category === category)
    .sort((a, b) => b.frontmatter.riskScore - a.frontmatter.riskScore);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">{categoryInfo.label}</h1>
      <p className="text-white/60 mb-10">{categoryInfo.description}</p>
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}

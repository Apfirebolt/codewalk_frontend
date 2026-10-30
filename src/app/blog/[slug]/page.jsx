import BlogDetailClient from "@/components/BlogDetailClient";
import httpClient from "@/lib/api";

// Generate dynamic SEO metadata based on the individual blog post
export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await httpClient.get(`/content/${slug}`);
    const item = res.data;

    // Extract first image from Editor.js blocks for OG image preview
    const coverImage = item.content?.blocks?.find((b) => b.type === 'image')?.data?.file?.url;

    return {
      title: `${item.title} | Codewalk Blog`,
      description: item.meta_description || 'Read this engineering article and technical write-up on Codewalk.',
      keywords: item.tags?.map((t) => t.name).join(', ') || 'blog, article, software engineering, codewalk',
      openGraph: {
        title: item.title,
        description: item.meta_description || 'Read this engineering article on Codewalk.',
        type: 'article',
        images: coverImage ? [{ url: coverImage }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Article Not Found | Codewalk',
      description: 'The requested blog article could not be found.',
    };
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
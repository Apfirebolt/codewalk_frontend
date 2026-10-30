import ProjectDetailClient from "@/components/ProjectDetailClient";
import httpClient from "@/lib/api";

// Generate dynamic SEO metadata based on the individual project item
export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await httpClient.get(`/content/${slug}`);
    const item = res.data;

    // Extract first image from Editor.js blocks for OG image preview
    const coverImage = item.content?.blocks?.find((b) => b.type === 'image')?.data?.file?.url;

    return {
      title: `${item.title} | Codewalk Projects`,
      description: item.meta_description || 'Explore this software project and technical architecture on Codewalk.',
      keywords: item.extra_metadata?.technologies?.join(', ') || 'project, portfolio, fastapi, nextjs, codewalk',
      openGraph: {
        title: item.title,
        description: item.meta_description || 'Explore this software project on Codewalk.',
        type: 'article',
        images: coverImage ? [{ url: coverImage }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Project Not Found | Codewalk',
      description: 'The requested project could not be found.',
    };
  }
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  return <ProjectDetailClient slug={slug} />;
}
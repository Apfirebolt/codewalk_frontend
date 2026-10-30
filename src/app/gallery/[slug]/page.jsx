import GalleryDetailClient from "@/components/GalleryDetailClient";
import httpClient from "@/lib/api";

// Generate dynamic SEO metadata based on the individual gallery snapshot
export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await httpClient.get(`/content/${slug}`);
    const item = res.data;

    // Extract first image from Editor.js blocks for OG image preview
    const coverImage = item.content?.blocks?.find((b) => b.type === 'image')?.data?.file?.url;

    return {
      title: `${item.title} | Codewalk Gallery`,
      description: item.meta_description || 'Explore this visual capture and snapshot on Codewalk.',
      keywords: item.tags?.map((t) => t.name).join(', ') || 'gallery, photography, codewalk',
      openGraph: {
        title: item.title,
        description: item.meta_description || 'Explore this visual capture on Codewalk.',
        type: 'article',
        images: coverImage ? [{ url: coverImage }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Snapshot Not Found | Codewalk',
      description: 'The requested gallery snapshot could not be found.',
    };
  }
}

export default async function GalleryDetailPage({ params }) {
  const { slug } = await params;
  return <GalleryDetailClient slug={slug} />;
}
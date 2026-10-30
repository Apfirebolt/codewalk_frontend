import GalleryClient from "@/components/GalleryClient";

export const metadata = {
  title: 'Gallery Snapshots | Codewalk',
  description: 'A curated visual showcase of travel moments, desk setups, and creative captures through the lens, powered by Cloudinary and FastAPI.',
  keywords: 'gallery, photography, travel, snapshots, creative captures, portfolio, codewalk',
  openGraph: {
    title: 'Gallery Snapshots | Codewalk',
    description: 'Explore visual moments and creative photography snapshots.',
    type: 'website',
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
import HomeClient from "@/components/HomeClient";

export const metadata = {
  title: 'Codewalk | Personal Blog, Projects & Gallery',
  description: 'A personal digital garden and portfolio showcasing software engineering articles, technical projects, and visual snapshots powered by FastAPI and Next.js.',
  keywords: 'blog, software engineering, portfolio, projects, gallery, developer, web development, python, fastapi',
  openGraph: {
    title: 'Codewalk | Personal Blog & Portfolio',
    description: 'Explore technical write-ups, engineering projects, and photography snapshots.',
    type: 'website',
  },
};

export default function Page() {
  return <HomeClient />;
}
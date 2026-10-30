import BlogClient from "@/components/BlogClient";

export const metadata = {
  title: 'Blog Articles & Engineering Logs | Codewalk',
  description: 'Read technical write-ups, backend engineering deep dives, architectural notes, and software development stories powered by FastAPI and Next.js.',
  keywords: 'blog, software engineering, backend, fastapi, python, web development, articles, codewalk',
  openGraph: {
    title: 'Blog Articles & Engineering Logs | Codewalk',
    description: 'Explore technical write-ups and developer stories.',
    type: 'website',
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
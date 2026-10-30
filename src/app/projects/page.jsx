import ProjectsClient from "@/components/ProjectsClient";

export const metadata = {
  title: 'Projects Showcase | Codewalk',
  description: 'Explore full-stack applications, open-source tools, backend APIs, and interactive digital experiences built with Python, FastAPI, React, and Next.js.',
  keywords: 'projects, portfolio, software engineering, full stack, fastapi, nextjs, python, react, codewalk',
  openGraph: {
    title: 'Projects Showcase | Codewalk',
    description: 'Explore full-stack applications and software engineering portfolio items.',
    type: 'website',
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
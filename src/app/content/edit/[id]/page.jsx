import EditPostClient from "@/components/EditPostClient";

export const metadata = {
  title: 'Edit Content | Codewalk Author Dashboard',
  description: 'Edit and update your blog articles, project showcases, and gallery snapshots.',
};

export default async function EditPostPage({ params }) {
  const { id } = await params;
  return <EditPostClient id={id} />;
}
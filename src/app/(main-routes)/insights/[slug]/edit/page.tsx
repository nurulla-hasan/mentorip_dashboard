import { getPostBySlug } from "@/services/posts";
import { getAllCategories } from "@/services/categories";
import { EditInsightForm } from "./edit-form";
import { notFound } from "next/navigation";

export default async function EditInsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch data on the server
  const [postRes, catRes] = await Promise.all([
    getPostBySlug(slug),
    getAllCategories(),
  ]);

  if (!postRes.success || !postRes.data) {
    return notFound();
  }

  const categories = catRes.success ? catRes.data : [];

  return <EditInsightForm post={postRes.data} categories={categories} />;
}

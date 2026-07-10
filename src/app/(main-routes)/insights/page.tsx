
import { insightsPostsColumns } from "@/components/insights/columns";
import { CategoryFilter } from "@/components/insights/category-filter";
import { StatusFilter } from "@/components/insights/status-filter";
import { CommonSearch } from "@/components/common/commom-search";
import { DashboardHeader } from "@/components/ui/custom/dashboard-header";
import { DataTable } from "@/components/ui/custom/data-table";
import { getAllPosts } from "@/services/posts";
import { getAllCategories } from "@/services/categories";
import { SearchParams } from "@/types/global.types";

export default async function InsightsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const [postsResponse, categoriesResponse] = await Promise.all([
    getAllPosts(params),
    getAllCategories({ limit: "100" }),
  ]);

  const posts = Array.isArray(postsResponse.data) ? postsResponse.data : [];
  const categories = Array.isArray(categoriesResponse.data)
    ? categoriesResponse.data
    : [];
  const meta = postsResponse.meta ?? {
    total: posts.length,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  return (
    <div className="space-y-6 p-1">
      <DashboardHeader
        title="Legal Insights Management"
        description="Manage blog posts, articles, and legal updates."
        length={posts.length}
      >
        <div className="flex items-center gap-2">
          <StatusFilter />
          <CategoryFilter categories={categories} />
          <CommonSearch />
        </div>
      </DashboardHeader>
      <DataTable
        columns={insightsPostsColumns}
        data={posts}
        meta={meta}
      />
    </div>
  );
}


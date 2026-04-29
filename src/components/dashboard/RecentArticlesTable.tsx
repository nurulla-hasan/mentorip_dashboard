
import { DataTable } from "@/components/ui/custom/data-table";
import { insightsPostsColumns } from "@/components/insights/columns";
import { Post } from "@/types/posts.type";

export default function RecentArticlesTable({ posts }: { posts: Post[] }) {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Recent Legal Insights</h2>
      <DataTable 
        columns={insightsPostsColumns} 
        data={posts} 
        pageSize={5} 
      />
    </div>
  );
}

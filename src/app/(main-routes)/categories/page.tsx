import { DataTable } from "@/components/ui/custom/data-table";
import { categoriesColumns } from "@/components/categories/columns";
import PageHeader from "@/components/ui/custom/page-header";
import { AddCategoryModal } from "@/components/categories/AddCategoryModal";

import { getAllCategories } from "@/services/categories";

export default async function CategoriesPage() {

  const { data: categories } = await getAllCategories();
  return (
    <div className="space-y-6 p-1">
      <div className="flex gap-2 flex-col md:flex-row justify-between">
        <PageHeader
          title="Categories"
          description="Manage legal categories, practice area, and tags."
          length={categories.length}
        />
          <AddCategoryModal />
      </div>
      <DataTable
        columns={categoriesColumns}
        data={categories}
        pageSize={categories.length}
      />
    </div>
  );
}

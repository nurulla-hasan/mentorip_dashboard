import { DataTable } from "@/components/ui/custom/data-table";
import { categoriesColumns } from "@/components/categories/columns";
import { DashboardHeader } from "@/components/ui/custom/dashboard-header";
import { AddCategoryModal } from "@/components/categories/AddCategoryModal";

import { getAllCategories } from "@/services/categories";

export default async function CategoriesPage() {

  const { data: categories } = await getAllCategories();
  return (
    <div className="space-y-6 p-1">
      <DashboardHeader
        title="Categories"
        description="Manage legal categories, practice area, and tags."
        length={categories.length}
      >
        <AddCategoryModal />
      </DashboardHeader>
      <DataTable
        columns={categoriesColumns}
        data={categories}
        pageSize={categories.length}
      />
    </div>
  );
}

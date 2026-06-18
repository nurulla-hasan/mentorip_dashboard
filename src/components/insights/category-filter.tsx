"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSmartFilter } from "@/hooks/useSmartFilter";
import { Category } from "@/types/category.type";

interface CategoryFilterProps {
  categories: Category[];
}

export const CategoryFilter = ({ categories }: CategoryFilterProps) => {
  const { getFilter, updateFilter } = useSmartFilter();

  const currentCategory = getFilter("category");

  return (
    <Select
      value={currentCategory || "all"}
      onValueChange={(value) => {
        if (value === "all") {
          updateFilter("category", null);
        } else {
          updateFilter("category", value);
        }
      }}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category._id} value={category.slug}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

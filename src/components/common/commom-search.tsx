"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSmartFilter } from "@/hooks/useSmartFilter";

export const CommonSearch = () => {
  const { updateFilter, getFilter } = useSmartFilter();

  return (
    <div className="relative h-fit">
      <Input
        placeholder="Search..."
        className="pl-10"
        defaultValue={getFilter("searchTerm")}
        onChange={(e) => updateFilter("searchTerm", e.target.value)}
      />
      <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
};
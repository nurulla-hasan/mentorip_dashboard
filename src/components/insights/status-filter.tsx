"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSmartFilter } from "@/hooks/useSmartFilter";

export const StatusFilter = () => {
  const { getFilter, updateFilter } = useSmartFilter();

  const currentStatus = getFilter("status");

  return (
    <Select
      value={currentStatus || "all"}
      onValueChange={(value) => {
        if (value === "all") {
          updateFilter("status", null);
        } else {
          updateFilter("status", value);
        }
      }}
    >
      <SelectTrigger className="w-35">
        <SelectValue placeholder="All Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="draft">Draft</SelectItem>
      </SelectContent>
    </Select>
  );
};

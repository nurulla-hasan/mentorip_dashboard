import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  length?: number;
  children?: ReactNode;
}

export function DashboardHeader({ title, description, length, children }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold font-heading uppercase tracking-tight text-foreground">
            {title}
          </h1>
          {length !== undefined && (
            <Badge className="rounded-full">{length}</Badge>
          )}
        </div>
        {description && (
          <p className="text-sm sm:text-base font-medium text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}

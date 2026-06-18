"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  change?: string;
}

export default function DashboardCard({ icon: Icon, title, value, change }: DashboardCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardContent className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 space-y-0.5">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold">{value}</h3>
            {change && (
              <Badge 
                variant={change.startsWith("+") ? "success" : change.startsWith("-") ? "destructive" : "secondary"}
                className="font-semibold"
              >
                {change}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban, Undo } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "banned";
  package: "free" | "basic" | "pro" | "premium";
  joinedDate: string;
  avatar?: string;
}

const packageDetails = {
  free: { name: "Free", ads: 6, variant: "outline" as const },
  basic: { name: "Basic", ads: 10, variant: "secondary" as const },
  pro: { name: "Pro", ads: 15, variant: "default" as const },
  premium: { name: "Premium", ads: 20, variant: "default" as const },
};

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "package",
    header: "Package",
    cell: ({ row }) => {
      const pkg = row.getValue("package") as keyof typeof packageDetails;
      const details = packageDetails[pkg];
      return (
        <Badge variant={details.variant} className="capitalize w-fit">
          {details.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "active"
              ? "default"
              : status === "banned"
              ? "destructive"
              : "secondary"
          }
          className="capitalize"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "joinedDate",
    header: "Joined Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("joinedDate")}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="text-right">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                {status === "active" ? (
                  <Ban className="h-4 w-4" />
                ) : (
                  <Undo className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {status === "active" ? "Ban User" : "Unban User"}
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];

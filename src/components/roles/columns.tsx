"use client";

import { useState } from "react";
import {
  Trash2,
  Loader2,
  ShieldCheck,
  Phone,
  Mail,
  ShieldAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Admin } from "@/types/admins.types";
import { deleteAdmin } from "@/services/admin";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

import { UpdateAdminModal } from "./UpdateAdminModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";



const ActionCell = ({ admin }: { admin: Admin }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteAdmin(admin._id);
      if (res.success) {
        SuccessToast("Admin deleted successfully!");
        setOpen(false);
      } else {
        ErrorToast(res.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 px-1">
      <UpdateAdminModal admin={admin} currentUserRole={user?.role || ""} />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            title="Delete"
            disabled={user?.role === "ADMIN"}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-4xl overflow-hidden p-0 gap-0">
          <div className="bg-destructive/5 p-8 border-b border-destructive/10 flex flex-col items-center text-center">
            <div className="p-3 bg-destructive/10 rounded-2xl mb-4">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              This will permanently delete{" "}
              <span className="font-bold text-foreground">{admin.name}</span>.
              This admin will lose all access to the dashboard.
            </AlertDialogDescription>
          </div>
          <AlertDialogFooter className="p-6 bg-background gap-3">
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-xl font-bold px-6"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold px-8 shadow-lg shadow-destructive/20"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete Admin"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const rolesColumns: ColumnDef<Admin>[] = [
  {
    accessorKey: "index",
    header: "S.L",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    meta: {
      headerClassName: "w-[60px]",
    },
  },
  {
    accessorKey: "image",
    header: "Admin",
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
            <AvatarImage
              src={admin.image}
              alt={admin.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
              {admin.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-foreground leading-none">
              {admin.name}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground font-medium">
              <Mail className="h-3 w-3" />
              {admin.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Contact",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <Phone className="h-3.5 w-3.5 opacity-60" />
        {row.original.phone || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Access Level",
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className="rounded-full px-3 py-0.5 border-none font-bold tracking-tight text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
        >
          <div className="flex items-center gap-1.5 uppercase">
            <ShieldCheck className="h-3 w-3" />
            {row.original.role}
          </div>
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.isActive ? "default" : "secondary"}
        className={`rounded-full px-3 py-0.5 border-none font-bold text-[10px] uppercase tracking-wider ${
          row.original.isActive
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100"
            : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400 hover:bg-gray-100"
        }`}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right pr-4">
          <ActionCell admin={row.original} />
        </div>
      );
    },
    enableSorting: false,
  },
];

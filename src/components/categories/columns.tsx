/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { Category } from "@/types/category.type";
import * as LucideIcons from "lucide-react";
import { UpdateCategoryModal } from "./UpdateCategoryModal";
import { deleteCategory } from "@/services/categories";
import { SuccessToast, ErrorToast } from "@/lib/utils";

const ActionCell = ({ category }: { category: Category }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteCategory(category._id);
      if (res.success) {
        SuccessToast(res.message || "Category deleted successfully!");
        window.location.reload();
      } else {
        ErrorToast(res.message || "Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-end">
      {/* Update Category */}
      <UpdateCategoryModal category={category} />

      {/* Delete Category */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category &quot;{category.name}&quot; and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Permanently"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const categoriesColumns: ColumnDef<Category>[] = [
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
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl;
      const isValidSrc = typeof imageUrl === 'string' && imageUrl.trim() !== '';

      return (
        <div className="relative w-12 h-12 rounded-full border overflow-hidden bg-muted">
          {isValidSrc ? (
            <Image
              src={imageUrl}
              alt={row.original.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : null}
        </div>
      );
    },
    enableSorting: false,
    meta: {
      headerClassName: "w-[80px]",
    },
  },
  {
    accessorKey: "iconName",
    header: "Icon",
    cell: ({ row }) => {
      const IconComponent = (LucideIcons as any)[row.original.iconName] || LucideIcons.HelpCircle;

      return (
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-primary" />
        </div>
      );
    },
    enableSorting: false,
    meta: {
      headerClassName: "w-[80px]",
    },
  },
  {
    accessorKey: "name",
    header: "Category Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <p className="text-sm text-muted-foreground max-w-75 truncate">
        {row.original.description}
      </p>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <ActionCell category={row.original} />,
    enableSorting: false,
  },
];

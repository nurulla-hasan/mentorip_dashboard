"use client";

import Link from "next/link";
import Image from "next/image";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Loader2, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Post } from "@/types/posts.type";
import { deletePost } from "@/services/posts";
import { toast } from "sonner";
import { useState } from "react";

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "draft":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    case "scheduled":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const ActionCell = ({ post }: { post: Post }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deletePost(post._id);
      if (res.success) {
        toast.success(res.message || "Post deleted successfully");
        window.location.reload();
      } else {
        toast.error(res.message || "Failed to delete post");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-end ">
      <Button variant="ghost" size="icon" title="View" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
        <Link href={`/insights/${post.slug}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>

      <Button variant="ghost" size="icon" title="Edit" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
        <Link href={`/insights/${post.slug}/edit`}>
          <Edit className="h-4 w-4" />
        </Link>
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" title="Delete" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post
              &quot;{post.title}&quot; and remove it from our servers.
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const insightsPostsColumns: ColumnDef<Post>[] = [
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
    accessorKey: "coverImage",
    header: "Cover",
    cell: ({ row }) => {
      const coverImage = row.original.coverImage;
      const isValidSrc = typeof coverImage === 'string' && coverImage.trim() !== '';

      return (
        <div className="relative w-12 h-12 rounded-full border overflow-hidden bg-muted">
          {isValidSrc ? (
            <Image
              src={coverImage}
              alt={row.original.title}
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
    accessorKey: "title",
    header: "Post Title",
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="font-medium max-w-75 truncate">
          {row.original.title}
        </p>
        {row.original.subtitle && (
          <p className="text-xs text-muted-foreground max-w-75 truncate">
            {row.original.subtitle}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      const categoryName = typeof category === 'object' && 'name' in category ? category.name : 'Unknown';

      return (
        <Badge className="inline-flex rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none">
          {categoryName}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={`inline-flex rounded border-none capitalize ${statusBadgeClass(status)}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "readTime",
    header: "Read Time",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.readTime}</span>
    ),
  },
  {
    accessorKey: "views",
    header: "Views",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {row.original.views.toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "tag",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.original.tag || [];
      if (tags.length === 0) return <span className="text-xs text-muted-foreground">No tags</span>;

      const tagContent = (
        <div className={`flex flex-wrap gap-1 max-w-50 ${tags.length > 2 ? "cursor-help" : ""}`}>
          {tags.slice(0, 2).map((tag, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="text-xs rounded-full"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="outline" className="text-xs rounded-full">
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      );

      if (tags.length <= 2) {
        return tagContent;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {tagContent}
            </TooltipTrigger>
            <TooltipContent className="p-2 max-w-75">
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[10px] rounded-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <div className="text-right whitespace-nowrap px-4">Action</div>,
    cell: ({ row }) => <ActionCell post={row.original} />,
    enableSorting: false,
  },
];


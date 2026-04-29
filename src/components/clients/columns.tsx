"use client";

import Image from "next/image";
import Link from "next/link";

import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Client } from "@/types/clients.types";
import { UpdateClientModal } from "./UpdateClientModal";
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
import { deleteClient } from "@/services/client";
import { ErrorToast, SuccessToast } from "@/lib/utils";

const ActionCell = ({ client }: { client: Client }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteClient(client._id);
      if (res.success) {
        SuccessToast("Client deleted successfully");
        setOpen(false);
      } else {
        ErrorToast(res.message || "Failed to delete client");
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
      <UpdateClientModal client={client} />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            title="Delete"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the client
              &quot;{client.name}&quot; and remove it from our servers.
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export const clientLogosColumns: ColumnDef<Client>[] = [
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
    accessorKey: "logoUrl",
    header: "Logo",
    cell: ({ row }) => {
      const logoUrl = row.original.logoUrl;
      const isValidSrc = typeof logoUrl === 'string' && logoUrl.trim() !== '';

      return (
        <div className="h-12 w-12 relative overflow-hidden rounded-full border">
          {isValidSrc ? (
            <Image
              src={logoUrl}
              alt={`${row.original.name} logo`}
              fill
              unoptimized
            />
          ) : null}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Client Name",
    cell: ({ getValue }) => (
      <span className="font-medium">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "websiteUrl",
    header: "Website URL",
    cell: ({ row }) => (
      <Link
        href={row.original.websiteUrl}
        className="text-primary hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        {row.original.websiteUrl}
      </Link>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Action</div>,
    cell: ({ row }) => <ActionCell client={row.original} />,
    enableSorting: false,
  },
];

"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryImage } from "@/types/gallery.types";
import { deleteGalleryImage } from "@/services/gallery";
import { SuccessToast, ErrorToast } from "@/lib/utils";
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

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await deleteGalleryImage(id);
      if (res.success) {
        SuccessToast("Image deleted successfully");
      } else {
        ErrorToast(res.message || "Failed to delete image");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  if (!images?.length) {
    return (
      <div className="flex h-100 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-accent/5">
        <p className="text-muted-foreground mt-4">No images found in gallery.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {images.map((image) => (
        <div
          key={image._id}
          className="group relative aspect-square overflow-hidden rounded-xl border bg-muted shadow-sm transition-all hover:shadow-md"
        >
          {image.imageUrl ? (
            <Image
              src={image.imageUrl}
              alt="Gallery image"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the image
                    from the gallery.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(image._id);
                    }}
                    disabled={deletingId === image._id}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deletingId === image._id ? (
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
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Edit } from "lucide-react";
import { updateCategory } from "@/services/categories";
import Image from "next/image";
import { ErrorToast, generateSlug, SuccessToast } from "@/lib/utils";
import { Category } from "@/types/category.type";

const formSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  iconName: z.string().min(2, "Icon name must be at least 2 characters"),
  category: z.any().optional(),
});

interface UpdateCategoryModalProps {
  category: Category;
}

export function UpdateCategoryModal({
  category
}: UpdateCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      iconName: "",
    },
  });

  // Reset form when category changes or modal opens
  useEffect(() => {
    if (category && open) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description,
        iconName: category.iconName,
      });
      setImagePreview(category.imageUrl);
    }
  }, [category, open, form]);

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    if (!form.formState.dirtyFields.slug) {
      form.setValue("slug", generateSlug(value));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("category", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue("category", undefined);
    setImagePreview(category.imageUrl); // Reset to original
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Postman structure: data (JSON string) and category (File)
      const categoryData = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        iconName: values.iconName,
      };

      formData.append("data", JSON.stringify(categoryData));
      
      // Append file if exists
      if (values.category instanceof File) {
        formData.append("category", values.category);
      }

      const res = await updateCategory(category._id, formData);

      if (res.success) {
        SuccessToast(res.message || "Category updated successfully!");
        setOpen(false);
        window.location.reload();
      } else {
        ErrorToast(res.message || "Failed to update category");
      }
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      ErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-137.5 max-h-[90vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category information.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            {/* Category Image */}
            <FormField
              control={form.control}
              name="category"
              render={() => (
                <FormItem>
                  <FormLabel>Category Image</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {imagePreview ? (
                        <div className="relative w-full h-40 rounded-lg overflow-hidden border bg-muted">
                          <Image
                            src={imagePreview}
                            alt="Category preview"
                            fill
                            className="object-cover"
                          />
                          {form.watch("category") instanceof File && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload category image
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                      {!form.watch("category") && imagePreview && (
                        <label className="flex items-center justify-center w-full py-2 border border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <Upload className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Change image</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Trademark"
                      {...field}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., trademark" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the category..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon Name */}
            <FormField
              control={form.control}
              name="iconName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon Name (Lucide)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Scale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button loading={isLoading} loadingText="Updating..." type="submit" disabled={isLoading}>
                Update Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

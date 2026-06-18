/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Star } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DashboardHeader } from "@/components/ui/custom/dashboard-header";
import { Input } from "@/components/ui/input";
import TiptapEditor from "@/components/ui/custom/tiptap-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPost } from "@/services/posts";
import { getAllCategories } from "@/services/categories";
import { ErrorToast, generateSlug, SuccessToast } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  tag: z.string().optional(),
  readTime: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  post: z.any().optional(), // For the file
  isFeatured: z.boolean().optional(),
  featuredOrder: z.string().optional(),
});

export default function NewInsightPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      slug: "",
      category: "",
      status: "draft",
      tag: "",
      readTime: "",
      content: "",
      post: undefined,
      isFeatured: false,
      featuredOrder: "",
    },
  });

  const isFeatured = form.watch("isFeatured");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (res.success && Array.isArray(res.data)) {
          const options = res.data.map((c: any) => ({
            label: c.name,
            value: c._id,
          }));
          setCategoryOptions(options);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Group text fields into 'data' object
      const postData = {
        title: values.title,
        subtitle: values.subtitle,
        slug: values.slug.replace(/-+$/, ""),
        category: values.category,
        status: values.status,
        tag: values.tag ? values.tag.split(",").map((t) => t.trim()).filter(Boolean) : [],
        readTime: values.readTime,
        content: values.content,
        isFeatured: values.isFeatured || false,
        featuredOrder: values.isFeatured ? Number(values.featuredOrder) : undefined,
      };

      formData.append("data", JSON.stringify(postData));

      // Append file if exists
      if (values.post instanceof File) {
        formData.append("post", values.post);
      }

      const res = await createPost(formData);

      if (res.success) {
        SuccessToast("Insight created successfully!");
        router.push("/insights");
      } else {
        ErrorToast(res.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      // ErrorToast("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Add New Legal Insight"
        description="Add new blog posts, articles, and legal updates."
      />
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* --- PRIMARY INFO --- */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a catchy post title"
                        className="text-lg h-12"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.setValue("slug", generateSlug(e.target.value));
                        }}
                        onBlur={() => {
                          field.onBlur();
                          const currentSlug = form.getValues("slug");
                          if (currentSlug) {
                            form.setValue(
                              "slug",
                              currentSlug.replace(/-+$/, "")
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Subtitle
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a brief summary or subtitle"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* --- METADATA (Left 2 Columns) --- */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-xl border bg-accent/5">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="post-slug-url"
                          {...field}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger> 
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. legal, trademark (comma separated)"
                          {...field}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="readTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Read Time</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 5 min"
                          {...field}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-full mt-2 p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Star className={`h-5 w-5 ${isFeatured ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Featured Insight</p>
                      <p className="text-xs text-muted-foreground">Highlight this post on the homepage</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {isFeatured && (
                      <FormField
                        control={form.control}
                        name="featuredOrder"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-2 space-y-0 animate-in fade-in slide-in-from-right-4 duration-300">
                            <FormLabel className="shrink-0 text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">Pos:</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-background h-9 w-28 border-primary/30 font-bold">
                                  <SelectValue placeholder="No" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    Rank {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* --- IMAGE UPLOAD (Right 1 Column) --- */}
              <div className="md:col-span-1">
                <FormField
                  control={form.control}
                  name="post"
                   
                  render={({
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    field: { onChange, value: _value, ...fieldProps },
                  }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between items-center mb-2">
                        Featured Image
                        {filePreview && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-bold">
                            Preview Mode
                          </span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-4">
                          {filePreview ? (
                            <div className="group relative aspect-[2.4/1.1] w-full overflow-hidden rounded-xl border-2 border-primary/20 bg-muted shadow-lg">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={filePreview}
                                alt="Preview"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="h-10 w-10 p-0 rounded-full shadow-xl hover:scale-110 transition-transform"
                                  onClick={() => {
                                    setFilePreview(null);
                                    form.setValue("post", undefined);
                                  }}
                                >
                                  <X className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <label className="flex aspect-[2.4/1.1] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-accent/5 transition-all duration-300 hover:bg-accent/10 hover:border-primary/50 hover:shadow-inner group">
                              <div className="flex flex-col items-center justify-center">
                                <div className="rounded-full bg-primary/10 p-3 mb-2 group-hover:scale-110 transition-transform duration-300">
                                  <Upload className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-xs font-medium">
                                  Click to upload banner
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  Wide Aspect Ratio Recommended
                                </p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, onChange)}
                                {...fieldProps}
                              />
                            </label>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* --- EDITOR AREA --- */}
            <div className="pt-6 border-t">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Post Content
                    </FormLabel>
                    <FormControl>
                      <TiptapEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Start writing the legal legacy here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end items-center gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="px-8"
              >
                Discard
              </Button>
              <Button
                loading={isSubmitting}
                loadingText="Publishing..."
                type="submit"
                disabled={isSubmitting}
                className="px-8"
              >
                Create Insight
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

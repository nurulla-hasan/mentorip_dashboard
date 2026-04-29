"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import TiptapEditor from "@/components/ui/custom/tiptap-editor";
import { upsertPage } from "@/services/pages";
import { SuccessToast, ErrorToast } from "@/lib/utils";
import { Save } from "lucide-react";

interface PageContentFormProps {
  initialContent: string;
  initialTitle: string;
  type: string;
}

export function PageContentForm({ initialContent, initialTitle, type }: PageContentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      title: initialTitle || "",
      content: initialContent || "",
    },
  });

  const onSubmit = async (data: { title: string; content: string }) => {
    setIsSubmitting(true);
    try {
      const res = await upsertPage({
        type: type,
        title: data.title,
        content: data.content,
      });

      if (res.success) {
        SuccessToast("Content updated successfully!");
      } else {
        ErrorToast(res.message || "Failed to update content");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Page Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-card p-3 rounded-xl border shadow-sm">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <TiptapEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                    <FormMessage className="p-4" />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            loadingText="Saving..."
            loading={isSubmitting}
          >
            <Save /> Save
          </Button>
        </div>
      </form>
    </Form>
  );
}

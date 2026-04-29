"use client";

import { useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { upsertHotlineAndSocials } from "@/services/contact";
import { ErrorToast, SuccessToast } from "@/lib/utils";

// --- Schemas & Types ---
const hotlineSchema = z.object({
  label: z.string().min(1, "Required"),
  value: z.string().min(1, "Required"),
});

const socialLinkSchema = z.object({
  label: z.string().min(1, "Required"),
  icon: z.string().min(1, "Required"),
  url: z.string().url("Invalid URL"),
});

const digitalPresenceSchema = z.object({
  title: z.string().min(1, "Required"),
  hotlines: z.array(hotlineSchema),
  socialLinks: z.array(socialLinkSchema),
});

type FormValues = z.infer<typeof digitalPresenceSchema>;

export function DigitalPresenceModal({
  initialValues,
}: {
  initialValues: FormValues;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(digitalPresenceSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const {
    fields: hotlineFields,
    append: appendHotline,
    remove: removeHotline,
  } = useFieldArray({
    control: form.control,
    name: "hotlines",
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await upsertHotlineAndSocials(values);
      if (res.success) {
        SuccessToast("Digital presence updated!");
        setOpen(false);
      } else {
        ErrorToast(res.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Digital Presence
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="px-6 py-6 border-b">
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
            Digital Presence
          </DialogTitle>
          <DialogDescription>
            Manage hotlines and social media links.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[75vh] whitespace-nowrap">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-8 py-6">
                  {/* Section Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Section Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-muted/20 h-12 text-lg font-medium focus-visible:ring-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Hotlines Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
                        Hotlines
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendHotline({ label: "", value: "" })}
                        className="h-8 border-dashed"
                      >
                        <Plus className="mr-2 h-3 w-3" /> Add Hotline
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {hotlineFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex gap-3 items-start group"
                        >
                          <FormField
                            control={form.control}
                            name={`hotlines.${index}.label`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Label (e.g. WhatsApp)"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`hotlines.${index}.value`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Number (e.g. +880...)"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeHotline(index)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {hotlineFields.length === 0 && (
                        <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/10 rounded-lg border border-dashed">
                          No hotlines added.
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Social Links Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-blue-700 dark:text-blue-400">
                        Social Links
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          appendSocial({ label: "", icon: "", url: "" })
                        }
                        className="h-8 border-dashed"
                      >
                        <Plus className="mr-2 h-3 w-3" /> Add Social Link
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {socialFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="p-4 rounded-xl border bg-card/50 space-y-3 relative group"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSocial(index)}
                            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="grid grid-cols-2 gap-3 pr-8">
                            <FormField
                              control={form.control}
                              name={`socialLinks.${index}.label`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">
                                    Label
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Facebook" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`socialLinks.${index}.icon`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">
                                    Icon Name (Use Lucide icon names)
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="facebook" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name={`socialLinks.${index}.url`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">
                                  URL
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                      {socialFields.length === 0 && (
                        <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/10 rounded-lg border border-dashed">
                          No social links added.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-6 border-t bg-muted/10 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={isSubmitting} loadingText="Saving...">
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

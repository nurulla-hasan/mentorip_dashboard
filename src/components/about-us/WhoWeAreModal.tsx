"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";

import { upsertWhoWeAre } from "@/services/about";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { WhoWeAreValues } from "@/types/who-we-are.types";

// --- Schema ---
const statSchema = z.object({
  value: z.string().min(1, "Required"),
  label: z.string().min(1, "Required"),
});

const whoWeAreSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  stats: z.tuple([statSchema, statSchema, statSchema, statSchema]),
  imageFile: z.any().optional().nullable(),
  imageAlt: z.string().optional(),
});

export function WhoWeAreModal({
  initialValues,
}: {
  initialValues: WhoWeAreValues;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WhoWeAreValues>({
    resolver: zodResolver(whoWeAreSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const onSubmit = async (values: WhoWeAreValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: values.title,
        subtitle: values.subtitle,
        slot1Value: values.stats[0].value,
        slot1Label: values.stats[0].label,
        slot2Value: values.stats[1].value,
        slot2Label: values.stats[1].label,
        slot3Value: values.stats[2].value,
        slot3Label: values.stats[2].label,
        slot4Value: values.stats[3].value,
        slot4Label: values.stats[3].label,
      };

      const res = await upsertWhoWeAre(payload);
      if (res.success) {
        SuccessToast("Who We Are updated!");
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
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Who We Are"
      description="Update the firm's overview and key statistics."
      actionTrigger={
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" /> Edit Content
        </Button>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <ScrollArea className="max-h-[70vh] whitespace-nowrap">
            <div className="px-6 py-6 space-y-8">
              {/* Main Content Section */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        Main Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-muted/20 h-12 text-lg font-bold focus-visible:ring-primary/50"
                          placeholder="A Legacy of Excellence..."
                          {...field}
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
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        Subtitle / Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-muted/20 resize-none text-base focus-visible:ring-primary/50 min-h-37.5"
                          placeholder="Our story began in..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-primary/10" />

              {/* Stats Section */}
              <div className="space-y-4">
                <h3 className="font-black italic text-xl uppercase tracking-tighter">
                  Key Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {([0, 1, 2, 3] as const).map((index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border-2 bg-card/50 space-y-4"
                    >
                      <div className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">
                        Statistic Slot #{index + 1}
                      </div>
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name={`stats.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">
                                Value
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-background"
                                  placeholder="e.g. 2010"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`stats.${index}.label`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">
                                Label
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-background"
                                  placeholder="e.g. Founded"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-37.5 font-black italic uppercase"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </ModalWrapper>
  );
}

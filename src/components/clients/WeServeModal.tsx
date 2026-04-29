/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { updateWeServe } from "@/services/client";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { WeServeValues } from "@/types/clients.types";
import { ModalWrapper } from "../ui/custom/modal-wrapper";

// --- Schema ---
const cardSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  iconName: z.string().min(1, "Required"),
});

const weServeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  cards: z.array(cardSchema).length(8),
});

export function WeServeModal({
  initialValues,
}: {
  initialValues: WeServeValues;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WeServeValues>({
    resolver: zodResolver(weServeSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const onSubmit = async (values: WeServeValues) => {
    setIsSubmitting(true);
    try {
      const payload: any = {
        title: values.title,
        subtitle: values.subtitle,
      };

      values.cards.forEach((card, index) => {
        const i = index + 1;
        payload[`card${i}Title`] = card.title;
        payload[`card${i}Description`] = card.description;
        payload[`card${i}IconName`] = card.iconName;
      });

      const res = await updateWeServe(payload);
      if (res.success) {
        SuccessToast("Industries We Serve updated!");
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
    <>
      <ModalWrapper
        open={open}
        onOpenChange={setOpen}
        title="Edit Content"
        description="Update the industries cards and main content."
        actionTrigger={
          <Button variant="outline" size="sm" className="gap-2">
            <Edit /> Edit Content
          </Button>
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <ScrollArea className="max-h-[70vh] whitespace-nowrap">
              <div className="px-6 py-6 space-y-8 pr-4">
                {/* Main Content Section */}
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                          Section Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-muted/20 h-12 font-bold focus:ring-primary/50"
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
                          Subtitle
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-muted/20 resize-none min-h-25"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="bg-primary/10" />

                {/* Cards Section */}
                <div className="space-y-4">
                  <h3 className="font-black italic text-xl uppercase tracking-tighter text-primary/80">
                    Industry Cards
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {([0, 1, 2, 3, 4, 5, 6, 7] as const).map((index) => (
                      <div
                        key={index}
                        className="p-5 rounded-2xl border-2 bg-card/50 space-y-4 shadow-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase bg-primary/10 text-primary px-2 py-1 rounded">
                            Card #{index + 1}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`cards.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] uppercase font-bold">
                                  Title
                                </FormLabel>
                                <FormControl>
                                  <Input className="bg-background" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`cards.${index}.iconName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] uppercase font-bold">
                                  Icon Name
                                </FormLabel>
                                <FormControl>
                                  <Input className="bg-background" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`cards.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase font-bold">
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  className="min-h-20 bg-background resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
            {/* Footer - Fixed */}
            <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                loadingText="Updating..."
                className="min-w-37.5 font-bold uppercase italic"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </ModalWrapper>
    </>
  );
}

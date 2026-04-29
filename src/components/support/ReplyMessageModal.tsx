"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Reply, User, Mail, MessageSquare } from "lucide-react";

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
import { SupportTicket } from "@/types/support.types";
import { SuccessToast, ErrorToast } from "@/lib/utils";
import { sendContactEmail } from "@/services/contact";
// import { replyContact } from "@/services/contact"; // Add this if endpoint exists

const formSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters long"),
  reply: z.string().min(10, "Reply must be at least 10 characters long"),
});

interface ReplyMessageModalProps {
  ticket: SupportTicket;
}

export function ReplyMessageModal({ ticket }: ReplyMessageModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: `Re: ${ticket.subject}`,
      reply: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("Replying to ticket:", ticket._id, values.reply);
      const res = await sendContactEmail({
        email: ticket.email,
        subject: values.subject,
        message: values.reply,
      });
      if (res.success) {
        SuccessToast("Reply sent successfully!");
        setOpen(false);
        form.reset();
        setIsSubmitting(false);
      } else {
        ErrorToast("Failed to send reply");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) form.reset();
    }}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" 
          size="icon"
          title={ticket.isReplied ? "Already Replied" : "Reply"}
          disabled={ticket.isReplied}
        >
          <Reply className={ticket.isReplied ? "opacity-50" : ""} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-150 gap-0 p-0 overflow-hidden rounded-4xl">
        <div className="bg-primary/5 p-8 border-b border-primary/10">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                    <Reply className="h-5 w-5 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-bold tracking-tight">Reply to Message</DialogTitle>
            </div>
            <DialogDescription className="text-base font-medium opacity-70">
              Send a professional response to {ticket.name}&apos;s inquiry.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8">
          {/* User & Message Info Card */}
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 grid gap-4">
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border text-primary">
                        <User className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground leading-none">{ticket.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                            <Mail className="h-3 w-3" />
                            {ticket.email}
                        </div>
                    </div>
                </div>
                <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Pending Reply
                </div>
            </div>
            
            <div className="p-4 bg-background/50 rounded-xl border border-border/30 italic text-sm text-muted-foreground relative group">
                <MessageSquare className="h-4 w-4 absolute -left-2 -top-2 text-primary opacity-20" />
                &quot;{ticket.message}&quot;
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold">Subject</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Email subject..." 
                        className="rounded-xl border-border/50 focus-visible:ring-primary/20 bg-background"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold flex items-center gap-2">
                        Your Response
                        <span className="text-xs font-normal opacity-50 px-2 py-0.5 bg-muted rounded-md text-[10px]">HTML SUPPORTED</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your professional response here..." 
                        className="min-h-50 resize-none rounded-2xl border-border/50 focus-visible:ring-primary/20 bg-background shadow-inner"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl font-bold px-6"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Discard
                </Button>
                <Button 
                    type="submit" 
                    className="rounded-xl font-bold px-8 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    loading={isSubmitting}
                    loadingText="Sending..."
                >
                  Send Response
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

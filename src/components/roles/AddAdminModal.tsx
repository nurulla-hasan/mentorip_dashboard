"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PlusCircle, UserPlus, Mail, Lock, User } from "lucide-react";

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
import { createAdmin } from "@/services/admin";
import { SuccessToast, ErrorToast } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function AddAdminModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await createAdmin(values);

      if (res.success) {
        SuccessToast("Admin created successfully!");
        setOpen(false);
        form.reset();
      } else {
        ErrorToast(res.message || "Failed to create admin");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) form.reset();
    }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle />
          Add Admin
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 gap-0 p-0 overflow-hidden rounded-4xl border-none shadow-2xl">
        <div className="bg-primary/5 p-8 border-b border-primary/10">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                    <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">Add New Admin</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground font-medium">
              Create a new administrator account with specific access.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <User className="h-3 w-3" /> Full Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        className="rounded-xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 transition-all h-11" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3 w-3" /> Email Address
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="admin@example.com" 
                        className="rounded-xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 transition-all h-11" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Lock className="h-3 w-3" /> Initial Password
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="••••••••" 
                        className="rounded-xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 transition-all h-11" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl font-bold px-6 h-11"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                    type="submit" 
                    className="rounded-xl font-bold px-8 h-11 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex-1"
                    loading={isSubmitting}
                    loadingText="Processing..."
                >
                  Create Account
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

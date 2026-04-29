"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Edit, UserCog, Mail, User } from "lucide-react";

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
import { updateAdmin } from "@/services/admin";
import { SuccessToast, ErrorToast } from "@/lib/utils";
import { Admin } from "@/types/admins.types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

interface UpdateAdminModalProps {
  admin: Admin;
  currentUserRole: string | null;
}

export function UpdateAdminModal({ admin, currentUserRole }: UpdateAdminModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: admin.name || "",
      email: admin.email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await updateAdmin(admin._id, values);

      if (res.success) {
        SuccessToast("Admin updated successfully!");
        setOpen(false);
      } else {
        ErrorToast(res.message || "Failed to update admin");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Edit"
          disabled={currentUserRole === "ADMIN"}
          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 gap-0 p-0 overflow-hidden rounded-4xl border-none shadow-2xl">
        <div className="bg-primary/5 p-8 border-b border-primary/10">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                    <UserCog className="h-5 w-5 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">Update Admin</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground font-medium">
              Update the basic profile details for <span className="text-primary font-bold">{admin.name}</span>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        className="rounded-xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 transition-all h-11 font-medium" 
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
                        className="rounded-xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 transition-all h-11 font-medium" 
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
                    loadingText="Updating..."
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

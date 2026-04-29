/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ChevronRight,
  LogOut,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { MENU_GROUPS, MenuGroup, MenuItem } from "@/constants/nav-items";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (href: string, isChild = false) => {
    if (href === "/") return pathname === "/";
    // For child menu items, use exact match
    if (isChild) return pathname === href;
    // For parent menu items, use startsWith
    return pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground hover:bg-muted">
          <PanelLeft className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-background border-r border-border">
        <SheetHeader className="p-4 border-b border-border flex items-center justify-start">
          <SheetTitle className="flex items-center w-full m-0">
            <Link href="/" className="flex items-center w-full px-2" onClick={() => setOpen(false)}>
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 w-auto object-contain dark:invert"
              />
            </Link>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-3 space-y-6 py-4 pb-20">
          {MENU_GROUPS.map((group: MenuGroup, groupIndex: number) => (
            <div key={groupIndex}>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-3">
                {group.title}
              </div>

              <div className="space-y-1">
                {group.items.map((item: MenuItem, itemIndex: number) => {
                  const Icon = item.icon;
                  const isExpanded = expandedItems.includes(item.label);
                  const active = isActive(item.href);
                  
                  return (
                    <div key={itemIndex}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start transition-colors px-3",
                          active 
                            ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-l-4 border-primary" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                        onClick={() => {
                          if (item.expandable) {
                            toggleExpand(item.label);
                          } else {
                            handleNavigation(item.href);
                          }
                        }}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                        {item.expandable && (
                          <ChevronRight 
                            className={cn(
                              "w-4 h-4 ml-auto transition-transform",
                              isExpanded && "rotate-90"
                            )} 
                          />
                        )}
                      </Button>

                      {item.children && isExpanded && (
                        <div className="ml-9 mt-1 space-y-1">
                          {item.children.map((child: { label: string; href: string; icon?: React.ElementType }, childIndex: number) => {
                            const ChildIcon = child.icon;
                            return (
                              <Button
                                key={childIndex}
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start text-sm px-3 py-1 h-8 gap-2",
                                  isActive(child.href, true)
                                    ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-l-4 border-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                                onClick={() => handleNavigation(child.href)}
                              >
                                {ChildIcon && <ChildIcon className="w-3.5 h-3.5" />}
                                {child.label}
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-border absolute bottom-0 w-full bg-background">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted px-3"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span>Log out</span>
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn, ErrorToast, SuccessToast } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MENU_GROUPS, MenuItem, MenuGroup } from "@/constants/nav-items";
import { logOut } from "@/services/auth";

interface SidebarProps {
  isCollapsed: boolean;
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string, isChild = false) => {
    if (href === "/") return pathname === "/";
    // For child menu items, use exact match
    if (isChild) return pathname === href;
    // For parent menu items, use startsWith
    return pathname.startsWith(href);
  };

   const handleLogout = async () => {
      setIsLoggingOut(true);
      try {
        await logOut();
        SuccessToast("Logged out successfully!");
        router.push("/auth/login");
      } catch (error) {
        console.error("Logout failed:", error);
        ErrorToast("Failed to logout. Please try again.");
      } finally {
        setIsLoggingOut(false);
      }
    };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative h-screen bg-background border-r border-border transition-all duration-300 hidden md:flex flex-col overflow-hidden",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 h-24">
          {!isCollapsed && (
            <Link href="/" className="flex items-center w-full px-2 group">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-12 w-auto object-contain dark:invert transition-all duration-300 group-hover:scale-105"
              />
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="flex items-center justify-center w-full group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:bg-primary/90 group-hover:shadow-primary/20 group-hover:shadow-lg group-hover:scale-110">
                <span className="text-primary-foreground font-bold text-xl select-none">
                  M
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Menu Groups */}
        <ScrollArea className="flex-1">
          <div className="flex-1 px-3 space-y-6 py-4">
            {MENU_GROUPS.map((group: MenuGroup, groupIndex: number) => (
              <div key={groupIndex}>
                {/* Group Title */}
                {!isCollapsed && (
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    {group.title}
                  </div>
                )}

                {/* Menu Items */}
                <div className="space-y-1">
                  {group.items.map((item: MenuItem, itemIndex: number) => {
                    const Icon = item.icon;
                    const isExpanded = expandedItems.includes(item.label);
                    const active = isActive(item.href);

                    const menuButton = (
                      <Button
                        key={itemIndex}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start transition-colors",
                          active
                            ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-x-4 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                          isCollapsed ? "px-0 justify-center" : "px-3"
                        )}
                        onClick={() => {
                          if (item.expandable) {
                            toggleExpand(item.label);
                          } else {
                            router.push(item.href);
                          }
                        }}
                      >
                        <Icon
                          className={cn("w-4 h-4", !isCollapsed && "mr-3")}
                        />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left">
                              {item.label}
                            </span>
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
                          </>
                        )}
                      </Button>
                    );

                    const menuItemContent = isCollapsed ? (
                      item.children ? (
                        <DropdownMenu key={itemIndex}>
                          <DropdownMenuTrigger asChild>
                            {menuButton}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side="right"
                            align="start"
                            className="w-56 ml-2 p-2 bg-background/95 border shadow-xl rounded-xl"
                          >
                            <DropdownMenuLabel className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {item.label}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-primary/5" />
                            <div className="mt-1 space-y-1">
                              {item.children.map((child, childIndex) => {
                                const ChildIcon = child.icon;
                                return (
                                  <DropdownMenuItem
                                    key={childIndex}
                                    className={cn(
                                      "flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary",
                                      isActive(child.href, true)
                                        ? "bg-primary/10 text-primary border-x-4 border-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                    )}
                                    onClick={() => router.push(child.href)}
                                  >
                                    {ChildIcon && <ChildIcon className="w-4 h-4" />}
                                    {child.label}
                                  </DropdownMenuItem>
                                );
                              })}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Tooltip key={itemIndex}>
                          <TooltipTrigger asChild>{menuButton}</TooltipTrigger>
                          <TooltipContent side="right" sideOffset={14}>
                            {item.label}
                          </TooltipContent>
                        </Tooltip>
                      )
                    ) : (
                      <div key={itemIndex}>
                        {menuButton}
                        {/* Submenu Items */}
                        {item.children && isExpanded && (
                          <div className="ml-9 mt-1 space-y-1">
                            {item.children.map((child, childIndex) => {
                              const ChildIcon = child.icon;
                              return (
                                <Link
                                  href={child.href}
                                  key={childIndex}
                                  className="block"
                                >
                                  <Button
                                    variant="ghost"
                                    className={cn(
                                      "w-full justify-start text-sm px-3 py-1 h-8 gap-2",
                                      isActive(child.href, true)
                                        ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-x-4 border-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                  >
                                    {ChildIcon && <ChildIcon className="w-3.5 h-3.5" />}
                                    {child.label}
                                  </Button>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );

                    return menuItemContent;
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Logout Button */}
        <div className="p-3 border-t border-border">
          {!isCollapsed ? (
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted px-3"
              onClick={handleLogout}
              loading={isLoggingOut}
              loadingText="Logging out..."
            >
              <LogOut />
              Log out
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={14}>
                Log out
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

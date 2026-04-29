"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PanelLeft, UserCircle, LogOut, Sun, Moon } from "lucide-react";

import MobileSidebar from "./MobileSidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorToast, getInitials, SuccessToast } from "@/lib/utils";
import { logOut } from "@/services/auth";
import { Spinner } from "@/components/ui/spinner";
import { useTheme } from "next-themes";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = useCurrentUser();


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
    <header className="h-20 bg-background border-b border-border flex items-center px-4 justify-between">
      {/* Left Section - Menu Toggle */}
      <div className="flex items-center gap-4">
        <MobileSidebar />
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={onToggleSidebar}
        >
          <PanelLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Right Section - Theme Switcher & User Menu */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && (theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          ))}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  src={user?.image || ""}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {getInitials(user?.name || "User")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-popover border-border"
            align="end"
            forceMount
          >
            {/* User Info Header */}
            <div className="flex items-center gap-3 p-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  src={user?.image || ""}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {getInitials(user?.name || "User")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-foreground">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role || "Admin"}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-border" />

            {/* Menu Items */}
            <DropdownMenuItem
              asChild
              className="text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            >
              <Link href="/account" className="flex items-center w-full">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>My Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            >
              {isLoggingOut ? (
                <Spinner className="mr-2 h-4 w-4" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

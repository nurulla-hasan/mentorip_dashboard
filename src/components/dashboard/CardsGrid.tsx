"use client";
import { FileText, Eye, Users, Scale } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { IDashboardStats } from "@/types/dashboard.types";

export default function CardsGrid({ stats }: { stats: IDashboardStats }) {
  const cards = [
    {
      icon: Users,
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "All time",
    },
    {
      icon: FileText,
      title: "Total Posts",
      value: stats.totalPosts.toLocaleString(),
      change: "All time",
    },
    {
      icon: Eye,
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      change: "All time",
    },
    {
      icon: Scale,
      title: "Categories",
      value: stats.totalCategories.toLocaleString(),
      change: "All time",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((s, i) => (
        <DashboardCard
          key={i}
          icon={s.icon}
          title={s.title}
          value={s.value}
          change={s.change}
        />
      ))}
    </div>
  );
}


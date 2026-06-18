"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { IGrowthSeries } from "@/types/dashboard.types";

const chartConfig: ChartConfig = {
  users: {
    label: "Monthly Users",
    color: "#2563eb", // Blue
  },
};

export default function InquiryGrowthChart({ data }: { data: IGrowthSeries[] }) {
  // Flatten the data for the chart
  const chartData = data.flatMap((series) =>
    series.data.map((item) => ({
      month: `${item.month} ${series.year}`,
      users: item.users,
    }))
  );

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-2">User Growth Trend</h2>
      <ChartContainer config={chartConfig} className="h-60 w-full">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="users"
            fill="var(--color-users)"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

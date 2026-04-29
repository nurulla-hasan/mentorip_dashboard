export interface IDashboardStats {
  totalCategories: number;
  totalPosts: number;
  totalUsers: number;
  totalViews: number;
}

export interface IGrowthData {
  month: string;
  users?: number;
  views?: number;
}

export interface IGrowthSeries {
  year: number;
  data: IGrowthData[];
}

export interface IDashboardData {
  stats: IDashboardStats;
  userGrowthSeries: IGrowthSeries[];
  viewGrowthSeries: IGrowthSeries[];
}

export interface IDashboardResponse {
  success: boolean;
  message: string;
  data: IDashboardData;
}

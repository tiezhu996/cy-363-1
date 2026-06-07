export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  status: string;
  metric: string;
}

export interface KpiItem {
  label: string;
  value: string;
  trend: string;
  tone: string;
}

export interface OperationRecord {
  key: string;
  name: string;
  owner: string;
  status: string;
  metric: string;
  priority: string;
}

export interface OverviewResponse {
  appName: string;
  appCode: string;
  description: string;
  features: FeatureItem[];
  kpis: KpiItem[];
  records: OperationRecord[];
}

export interface RevenueRecord {
  id: number;
  themeName: string;
  sessionTime: string;
  income: number;
  expense: number;
  actualAttendance: number;
  reservationCount: number;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RevenueSummary {
  todayRevenue: number;
  totalReservation: number;
  fulfillmentRate: number;
  todayExpense: number;
  todayNetProfit: number;
}

export interface RevenueListResponse {
  list: RevenueRecord[];
  total: number;
}

export interface CreateRevenueRequest {
  themeName: string;
  sessionTime: string;
  income: number;
  expense: number;
  actualAttendance: number;
  reservationCount: number;
  remark?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

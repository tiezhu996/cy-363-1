import { API_BASE_URL } from "../constants/app";
import type {
  OverviewResponse,
  RevenueRecord,
  RevenueListResponse,
  RevenueSummary,
  CreateRevenueRequest,
  ApiResponse,
} from "../types";

function normalizeRevenueRecord(record: RevenueRecord): RevenueRecord {
  return {
    ...record,
    income: Number(record.income),
    expense: Number(record.expense),
    actualAttendance: Number(record.actualAttendance),
    reservationCount: Number(record.reservationCount),
  };
}

export async function fetchOverview(): Promise<OverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/overview`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Overview request failed: ${response.status}`);
  }

  return response.json() as Promise<OverviewResponse>;
}

export async function createRevenueRecord(data: CreateRevenueRequest): Promise<ApiResponse<RevenueRecord>> {
  const response = await fetch(`${API_BASE_URL}/revenue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Create revenue record failed: ${response.status}`);
  }

  const result = (await response.json()) as ApiResponse<RevenueRecord>;
  if (result.success && result.data) {
    result.data = normalizeRevenueRecord(result.data);
  }
  return result;
}

export async function fetchRevenueRecords(params?: {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<RevenueListResponse>> {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

  const url = `${API_BASE_URL}/revenue${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Fetch revenue records failed: ${response.status}`);
  }

  const result = (await response.json()) as ApiResponse<RevenueListResponse>;
  if (result.success && result.data?.list) {
    result.data.list = result.data.list.map(normalizeRevenueRecord);
  }
  return result;
}

export async function fetchRevenueSummary(): Promise<ApiResponse<RevenueSummary>> {
  const response = await fetch(`${API_BASE_URL}/revenue/summary`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Fetch revenue summary failed: ${response.status}`);
  }

  return response.json() as Promise<ApiResponse<RevenueSummary>>;
}

export async function updateRevenueRecord(
  id: number,
  data: Partial<CreateRevenueRequest>
): Promise<ApiResponse<RevenueRecord>> {
  const response = await fetch(`${API_BASE_URL}/revenue/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Update revenue record failed: ${response.status}`);
  }

  const result = (await response.json()) as ApiResponse<RevenueRecord>;
  if (result.success && result.data) {
    result.data = normalizeRevenueRecord(result.data);
  }
  return result;
}

export async function deleteRevenueRecord(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/revenue/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Delete revenue record failed: ${response.status}`);
  }

  return response.json() as Promise<ApiResponse<null>>;
}

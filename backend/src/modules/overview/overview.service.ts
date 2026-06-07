import { overviewData } from "./overview.data";
import { RevenueService } from "../revenue/revenue.service";

const revenueService = new RevenueService();

export class OverviewService {
  async getOverview() {
    try {
      const summary = await revenueService.getSummary();

      const dynamicKpis = [
        {
          label: "今日营收",
          value: `¥${summary.todayRevenue.toFixed(0)}`,
          trend: `净利 ¥${summary.todayNetProfit.toFixed(0)}`,
          tone: "primary",
        },
        {
          label: "今日预约",
          value: `${summary.totalReservation}`,
          trend: `${summary.totalReservation} 人`,
          tone: "warm",
        },
        {
          label: "履约率",
          value: `${summary.fulfillmentRate}%`,
          trend: summary.fulfillmentRate >= 90 ? "表现优秀" : summary.fulfillmentRate >= 70 ? "正常水平" : "需关注",
          tone: summary.fulfillmentRate >= 90 ? "cool" : summary.fulfillmentRate >= 70 ? "primary" : "neutral",
        },
        {
          label: "今日支出",
          value: `¥${summary.todayExpense.toFixed(0)}`,
          trend: "运营成本",
          tone: "neutral",
        },
      ];

      return {
        ...overviewData,
        kpis: dynamicKpis,
      };
    } catch (error) {
      console.error("Failed to fetch revenue summary:", error);
      return overviewData;
    }
  }
}

import { Op, fn, col, literal } from "sequelize";
import { RevenueRecord } from "../../models/RevenueRecord";
import type { RevenueRecordCreationAttributes, RevenueRecordAttributes } from "../../models/RevenueRecord";

export interface RevenueSummary {
  todayRevenue: number;
  totalReservation: number;
  fulfillmentRate: number;
  todayExpense: number;
  todayNetProfit: number;
}

export interface RevenueListResponse {
  list: RevenueRecordAttributes[];
  total: number;
}

export class RevenueService {
  async createRecord(data: RevenueRecordCreationAttributes): Promise<RevenueRecordAttributes> {
    const record = await RevenueRecord.create(data);
    return record.toJSON();
  }

  async getRecordList(params: {
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }): Promise<RevenueListResponse> {
    const { startDate, endDate, page = 1, pageSize = 20 } = params;

    const where: any = {};

    if (startDate && endDate) {
      where.sessionTime = {
        [Op.between]: [new Date(startDate), new Date(endDate + " 23:59:59")],
      };
    } else if (startDate) {
      where.sessionTime = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      where.sessionTime = {
        [Op.lte]: new Date(endDate + " 23:59:59"),
      };
    }

    const { count, rows } = await RevenueRecord.findAndCountAll({
      where,
      order: [["sessionTime", "DESC"]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return {
      list: rows.map((row) => row.toJSON()),
      total: count,
    };
  }

  async getSummary(): Promise<RevenueSummary> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayResult = await RevenueRecord.findOne({
      attributes: [
        [fn("SUM", col("income")), "totalIncome"],
        [fn("SUM", col("expense")), "totalExpense"],
        [fn("SUM", col("reservation_count")), "totalReservation"],
        [fn("SUM", col("actual_attendance")), "totalAttendance"],
      ],
      where: {
        sessionTime: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
      raw: true,
    });

    const todayRevenue = Number((todayResult as any)?.totalIncome || 0);
    const todayExpense = Number((todayResult as any)?.totalExpense || 0);
    const totalReservation = Number((todayResult as any)?.totalReservation || 0);
    const totalAttendance = Number((todayResult as any)?.totalAttendance || 0);

    const fulfillmentRate = totalReservation > 0 ? Math.round((totalAttendance / totalReservation) * 100) : 0;

    return {
      todayRevenue,
      totalReservation,
      fulfillmentRate,
      todayExpense,
      todayNetProfit: todayRevenue - todayExpense,
    };
  }

  async updateRecord(id: number, data: Partial<RevenueRecordCreationAttributes>): Promise<RevenueRecordAttributes | null> {
    const record = await RevenueRecord.findByPk(id);
    if (!record) return null;
    await record.update(data);
    return record.toJSON();
  }

  async deleteRecord(id: number): Promise<boolean> {
    const record = await RevenueRecord.findByPk(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }
}

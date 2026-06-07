import type { Request, Response } from "express";
import { RevenueService } from "./revenue.service";
import { body, validationResult } from "express-validator";

const service = new RevenueService();

export const createRevenueValidation = [
  body("themeName").notEmpty().withMessage("主题名称不能为空"),
  body("sessionTime").notEmpty().withMessage("场次时间不能为空"),
  body("income").isNumeric().withMessage("收入必须是数字").toFloat(),
  body("expense").isNumeric().withMessage("支出必须是数字").toFloat(),
  body("actualAttendance").isInt().withMessage("实际上座人数必须是整数").toInt(),
  body("reservationCount").isInt().withMessage("预约人数必须是整数").toInt(),
];

export async function createRevenueRecord(request: Request, response: Response) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const record = await service.createRecord(request.body);
    response.json({ success: true, data: record });
  } catch (error) {
    response.status(500).json({ success: false, message: "创建失败", error: (error as Error).message });
  }
}

export async function getRevenueRecords(request: Request, response: Response) {
  try {
    const { startDate, endDate, page, pageSize } = request.query;
    const result = await service.getRecordList({
      startDate: startDate as string,
      endDate: endDate as string,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    response.json({ success: true, data: result });
  } catch (error) {
    response.status(500).json({ success: false, message: "查询失败", error: (error as Error).message });
  }
}

export async function getRevenueSummary(_request: Request, response: Response) {
  try {
    const summary = await service.getSummary();
    response.json({ success: true, data: summary });
  } catch (error) {
    response.status(500).json({ success: false, message: "获取汇总数据失败", error: (error as Error).message });
  }
}

export async function updateRevenueRecord(request: Request, response: Response) {
  try {
    const { id } = request.params;
    const record = await service.updateRecord(Number(id), request.body);
    if (!record) {
      return response.status(404).json({ success: false, message: "记录不存在" });
    }
    response.json({ success: true, data: record });
  } catch (error) {
    response.status(500).json({ success: false, message: "更新失败", error: (error as Error).message });
  }
}

export async function deleteRevenueRecord(request: Request, response: Response) {
  try {
    const { id } = request.params;
    const success = await service.deleteRecord(Number(id));
    if (!success) {
      return response.status(404).json({ success: false, message: "记录不存在" });
    }
    response.json({ success: true, message: "删除成功" });
  } catch (error) {
    response.status(500).json({ success: false, message: "删除失败", error: (error as Error).message });
  }
}

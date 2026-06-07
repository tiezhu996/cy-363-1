import { Router } from "express";
import {
  createRevenueRecord,
  getRevenueRecords,
  getRevenueSummary,
  updateRevenueRecord,
  deleteRevenueRecord,
  createRevenueValidation,
} from "./revenue.controller";

export const revenueRouter = Router();

revenueRouter.post("/revenue", createRevenueValidation, createRevenueRecord);
revenueRouter.get("/revenue", getRevenueRecords);
revenueRouter.get("/revenue/summary", getRevenueSummary);
revenueRouter.put("/revenue/:id", updateRevenueRecord);
revenueRouter.delete("/revenue/:id", deleteRevenueRecord);

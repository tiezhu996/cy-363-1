import type { Request, Response } from "express";
import { OverviewService } from "./overview.service";

const service = new OverviewService();

export async function getOverview(_request: Request, response: Response) {
  const data = await service.getOverview();
  response.json(data);
}

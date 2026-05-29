import type { NextFunction, Request, Response } from "express";
import { sendError, sendNotFound, sendSuccess } from "../utils/response.js";
import { PlanService } from "../services/PlanService.js";

const planService = new PlanService();

export const getPlans = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const plans = await planService.listPlans();

    return sendSuccess(res, { plans }, "Plans retrieved successfully", 200);
  } catch (error) {
    return next(error);
  }
};

export const getPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Plan id is required", 400);
    }

    const plan = await planService.getPlanById(id);

    if (!plan) {
      return sendNotFound(res, "Plan not found");
    }

    return sendSuccess(res, { plan }, "Plan retrieved successfully", 200);
  } catch (error) {
    return next(error);
  }
};

export const getOwnerStorePlan = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.user?.id;

    if (!ownerId) {
      return sendError(res, "Unauthorized", 401);
    }

    const result = await planService.getOwnerStorePlan(ownerId);

    if (!result) {
      return sendNotFound(res, "Store not found");
    }

    return sendSuccess(
      res,
      result,
      "Store subscription retrieved successfully",
      200,
    );
  } catch (error) {
    return next(error);
  }
};

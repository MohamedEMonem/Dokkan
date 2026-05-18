import { Request, Response, NextFunction } from "express";
import { StoreServices } from "../services/StoreServices.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { CreateStoreDto } from "../DTO/store.dto.js";

const storeService = new StoreServices();

export const createStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto: CreateStoreDto = req.body.data;
    const currentUserId = (req as Request & { user?: { id: string } }).user?.id;

    if (!currentUserId) {
      return sendError(res, "Unauthorized", 401);
    }

    const newStore = await storeService.createStore(dto, currentUserId);

    return sendSuccess(res, { newStore }, "Store created successfully", 201);
  } catch (error) {
    const cause = error as Error & { statusCode?: number };
    const err: any = new Error(cause.message || "Failed to create store");
    err.status = cause.statusCode || 500;
    return next(err);
  }
};

export const getUserStore = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return sendError(res, "Unauthorized", 401);
    }
    const userWithStore = await storeService.getUserwithStores(currentUserId);

    return sendSuccess(
      res,
      { userWithStore: userWithStore },
      "retrived successfully",
      200,
    );
  } catch (error) {
    sendError(res, "Failed to retrieve store", 500);
  }
};

export const listStores = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(String(req.query.limit ?? "20"), 10)),
    );

    const result = await storeService.listStores(page, limit);

    return sendSuccess(
      res,
      { stores: result.stores, meta: result.meta },
      "Stores retrieved successfully",
      200,
    );
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user!.id;
    const updateData = req.body.data;

    const updatedStore = await storeService.updateStore(
      currentUserId,
      updateData,
    );
    return sendSuccess(
      res,
      { updatedStore },
      "Store updated successfully",
      200,
    );
  } catch (error) {
    sendError(res, "Failed to update store", 500);
  }
};

export const deleteStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return sendError(res, "Unauthorized", 401);
    }

    const deletedStore = await storeService.deleteStore(currentUserId);

    return sendSuccess(
      res,
      { deletedStore },
      "Store deleted successfully",
      200,
    );
  } catch (error) {
    const cause = error as Error & { statusCode?: number };
    const err: any = new Error(cause.message || "Failed to delete store");
    err.status = cause.statusCode || 500;
    return next(err);
  }
};

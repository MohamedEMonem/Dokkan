import { Request, Response, NextFunction } from "express";
import { StoreServices } from "../services/StoreServices.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { CreateStoreDto, ListStoresQueryDto, listStoresQuerySchema } from "../DTO/store.dto.js";
import {meilisearchService} from "../services/meilisearchService.js";

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
    const searchAbleStore = {
      id: newStore.store.id,
      name: newStore.store.name,
      subdomain: newStore.store.subdomain,
      description: newStore.store.description,
      ownerId: newStore.store.ownerId,
      storeOwner: newStore.storeowner.name
      
    }
    meilisearchService.add("stores", searchAbleStore);

    return sendSuccess(res, { store: newStore.store }, "Store created successfully", 201);
  } catch (error) {
    const cause = error as Error & { statusCode?: number };
    const err: any = new Error(cause.message || "Failed to create store");
    err.status = cause.statusCode || 500;
    return next(err);
  }
};

export const getOwnerStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return sendError(res, "Unauthorized", 401);
    }
    const store = await storeService.getOwnerStore(currentUserId);

    return sendSuccess(
      res,
      { store },
      "Store retrieved successfully",
      200,
    );
  } catch (error) {
    return next(error);
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
    const listQuerys: ListStoresQueryDto = {
      page,
      limit,
      status: req.query.status as "Pending" | "Active" | "Suspended",
      sortBy: req.query.sortBy as "name" | "status" | "createdAt" || "createdAt",
      sortDir: (req.query.sortDir as "asc" | "desc") || "desc",
    }
    const parsedQuery = listStoresQuerySchema.safeParse(listQuerys);
    if (!parsedQuery.success) {
      return sendError(res, "Invalid query parameters", 400);
    }
    const result = await storeService.listStores(parsedQuery.data);

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

export const updateOwnerStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return sendError(res, "Unauthorized", 401);
    }
    const updateData = req.body.data;

    const updatedStore = await storeService.updateStore(
      currentUserId,
      updateData,
    );
     const searchAbleStore = {
      id: updatedStore.id,
      name: updatedStore.name,
      subdomain: updatedStore.subdomain,
      description: updatedStore.description,
      ownerId: updatedStore.ownerId,
      
    }
    meilisearchService.update("stores", searchAbleStore);
    return sendSuccess(
      res,
      { store: updatedStore },
      "Store updated successfully",
      200,
    );
  } catch (error) {
    return next(error);
  }
};

export const deleteOwnerStore = async (
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
    meilisearchService.delete("stores", deletedStore.id);

    return sendSuccess(
      res,
      { store: deletedStore },
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

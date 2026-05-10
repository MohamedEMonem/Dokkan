import {Request, Response, NextFunction} from "express";
import {StoreServices} from "../services/StoreServices.js"
import {sendSuccess,sendError} from "../utils/response.js"
import { CreateStoreDto } from "../DTO/store.dto.js";


const storeService = new StoreServices()

export const createStore = async (req: Request, res: Response, next: NextFunction)=>{
try{
    const dto: CreateStoreDto = req.body.data;
    const currentUserId = (req as Request & { user?: { id: string } }).user?.id;

    if (!currentUserId) {
        return sendError(res, "Unauthorized", 401);
    }

    const newStore = await storeService.createStore(dto, currentUserId);
    const userWithStores = await storeService.getUserwithStores(currentUserId);
    const userStoreCount = userWithStores?.ownedStores.length

    return sendSuccess(res, { newStore, userStoreCount,userWithStores }, "Store created successfully", 201);
}catch(error){
    const cause = error as Error & { statusCode?: number };
    const err: any = new Error(cause.message || "Failed to create store");
    err.status = cause.statusCode || 500;
    return next(err);
}
}
export const getStore = async (req: Request, res: Response)=>{



}

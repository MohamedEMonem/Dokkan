import {Request, Response} from "express";
import {StoreServices} from "./store.service.js"
import {sendSuccess,sendError} from "../../utils/response.js"
import { CreateStoreDto } from "../../DTO/store.dto.js";

const storeService = new StoreServices()

export const createStore = async (req: Request, res: Response)=>{
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
    return sendError(res, cause.message || "Failed to create store", cause.statusCode || 500);
}


}

import type { NextFunction, Request, Response } from "express";
import { meilisearchService } from "../services/meilisearchService.js";
import { sendError, sendSuccess } from "../utils/response.js";

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q } = req.query;

        if (!q) {
            return sendError(res, "Query parameter 'q' is required", 400);
        }
        if( String(q).length >100){
            return sendError(res, "Query parameter 'q' must be less than 100 characters", 400);
        }

        const searchResults = await meilisearchService.search("products", String(q));
        return sendSuccess(res, searchResults.hits, "Search results retrieved successfully");
    }
    catch (error) {
        return next(error);
    }
}

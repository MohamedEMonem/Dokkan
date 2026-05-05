import type { NextFunction, Request, Response } from "express";
import prisma from "../config/db.js";
import { sendError, sendServerError } from "../utils/response.js";

export const resolveTenant = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { storeSlug } = req.params as { storeSlug?: string };

		if (!storeSlug) {
			return sendError(res, "Store slug is required", 400);
		}

		const store = await prisma.store.findFirst({
			where: {
				subdomain: storeSlug,
				deletedAt: null,
			},
		});

		if (!store) {
			return sendError(res, "Store not found", 404);
		}

		(req as Request & { store?: typeof store }).store = store;

		return next();
	} catch (error) {
		return sendServerError(res, "Failed to resolve store tenant", error);
	}
};

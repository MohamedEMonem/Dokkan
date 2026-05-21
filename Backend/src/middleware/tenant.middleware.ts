import type { NextFunction, Request, Response } from "express";
import prisma from "../config/db.js";
import { sendError, sendServerError } from "../utils/response.js";

export const resolveTenant = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const { storeSlug } = req.params as { storeSlug?: string };

		if (!storeSlug) {
			const err: any = new Error("Store slug is required");
			err.status = 400;
			return next(err);
		}

		const store = await prisma.store.findFirst({
			where: {
				subdomain: storeSlug,
				deletedAt: null,
			},
		});

		if (!store) {
			const err: any = new Error("Store not found");
			err.status = 404;
			return next(err);
		}

		(req as Request & { store?: typeof store }).store = store;

		return next();
	} catch (error) {
		return next(error);
	}
};

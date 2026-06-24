import type { NextFunction, Request, Response } from "express";
import prisma from "../config/db.js";
import { sendError, sendServerError } from "../utils/response.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

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
			},
		});

		if (!store) {
			const err: any = new Error("Store not found");
			err.status = 404;
			return next(err);
		}

		let isAuthorizedToViewSuspended = false;
		const authHeader = req.header("Authorization");
		if (authHeader) {
			const match = authHeader.trim().match(/^Bearer\s+([^\s]+)$/);
			if (match) {
				try {
					const decoded = jwt.verify(match[1], process.env.JWT_SECRET as string) as JwtPayload & { userId: string };
					const user = await prisma.user.findFirst({ where: { id: decoded.userId } });
					if (user && (user.role === "Admin" || (user.role === "StoreOwner" && store.ownerId === user.id))) {
						isAuthorizedToViewSuspended = true;
					}
				} catch (e) {
					// ignore token errors for tenant resolution
				}
			}
		}

		if (!isAuthorizedToViewSuspended && (store.deletedAt !== null || store.status !== "Active")) {
			const err: any = new Error("Store not found or suspended");
			err.status = 404;
			return next(err);
		}

		(req as Request & { store?: typeof store }).store = store;

		return next();
	} catch (error) {
		return next(error);
	}
};

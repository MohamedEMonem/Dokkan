import { CreateStoreDto } from "../../DTO/store.dto.js";
import prisma from "../../config/db.js";

export class StoreServices {
    
    async createStore(dto: CreateStoreDto, ownerId: string) {
        const existingSubdomain = await prisma.store.findUnique({
            where: { subdomain: dto.subdomain },
        });

        if (existingSubdomain) {
            const error = new Error("Subdomain already exists") as Error & {
                statusCode?: number;
            };
            error.statusCode = 409;
            throw error;
        }

        const existingStoreName = await prisma.store.findFirst({
            where: { name: dto.name },
        });

        if (existingStoreName) {
            const error = new Error("Store name already exists") as Error & {
                statusCode?: number;
            };
            error.statusCode = 409;
            throw error;
        }

        try {
            const [store, storeowner] = await prisma.$transaction([
                prisma.store.create({
                    data: {
                        ...dto,
                        status: 'Pending',
                        owner: {
                            connect: { id: ownerId }
                        }
                    },
                }),
                prisma.user.update({
                    where: { id: ownerId },
                    data: {
                        role: 'StoreOwner',
                    }
                })
            ]);

            return {store, storeowner};
        } catch (error) {
            const prismaError = error as { code?: string; meta?: { target?: unknown } };
            if (prismaError.code === "P2002") {
                const targetValue = prismaError.meta?.target;
                const targets = Array.isArray(targetValue)
                    ? targetValue.map((value) => String(value).toLowerCase())
                    : [String(targetValue ?? "").toLowerCase()];

                let conflictMessage = "A unique field already exists";
                if (targets.some((target) => target.includes("subdomain"))) {
                    conflictMessage = "Subdomain already exists";
                } else if (targets.some((target) => target.includes("name"))) {
                    conflictMessage = "Store name already exists";
                }

                const conflictError = new Error(conflictMessage) as Error & { statusCode?: number };
                conflictError.statusCode = 409;
                throw conflictError;
            }

            throw error;
        }
    }
    async getUserWithStores(userId: string) {
        const userWithStores = await prisma.user.findUnique({
            where: {id : userId},
            include:{
                ownedStores:{
                    where: {
                        deletedAt: null 
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })
        return userWithStores;
    }
}

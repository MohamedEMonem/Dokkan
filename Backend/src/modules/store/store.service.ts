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

        const existingStoreName = await prisma.store.findUnique({
            where: { name: dto.name },
        });

        if (existingStoreName) {
            const error = new Error("Store name already exists") as Error & {
                statusCode?: number;
            };
            error.statusCode = 409;
            throw error;
        }

     
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
            where:{id:ownerId},
            data: {
                role: 'StoreOwner',

            }
        })

    ]);

        return {store, storeowner};
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

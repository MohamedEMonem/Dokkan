import {
  updatestoreSchema,
  type CreateStoreDto,
  type updateStoreDto,
} from "../DTO/store.dto.js";
import prisma from "../config/db.js";

export class StoreServices {
  async createStore(dto: CreateStoreDto, ownerId: string) {
    // 1. Check for existing subdomain
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

    // 2. Check for existing store name
    const existingStoreName = await prisma.store.findUnique({
      where: {
        name: dto.name,
      },
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
          status: "Pending",
          owner: {
            connect: { id: ownerId },
          },
        },
      }),
      prisma.user.update({
        where: { id: ownerId },
        data: {
          role: "StoreOwner",
        },
      }),
    ]);

    return { store, storeowner };
  }
  async getUserwithStores(userId: string) {
    const userWithStores = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        ownedStores: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return userWithStores;
  }

  async listStores(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const where = {
      deletedAt: null,
      status: "Active" as const,
    };

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          subdomain: true,
          description: true,
          coverBannerUrl: true,
          businessAddress: true,
          supportEmail: true,
          phoneNumber: true,
          operatingHours: true,
          socialMediaLinks: true,
          createdAt: true,
        },
      }),
      prisma.store.count({ where }),
    ]);

    return {
      stores,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // updateStore
  async updateStore(userId: string, datatoupdate: updateStoreDto) {
    const owner = await this.getUserwithStores(userId);

    // 1. Authorization Check
    if (owner?.role !== "StoreOwner" && owner?.role !== "Admin") {
      const error = new Error(
        "User is not authorized to edit this store",
      ) as Error & { statusCode?: number };
      error.statusCode = 403;
      throw error;
    }

    const storeSubdomain = owner.ownedStores?.subdomain; // Assuming ownedStores is now a single object, not an array

    // 2. 1-to-1 Store Check
    const store = owner.ownedStores; // This is a single object now, not an array

    if (!store || store.subdomain !== storeSubdomain) {
      const error = new Error(
        "Store not found or you do not own this subdomain",
      ) as Error & { statusCode?: number };
      error.statusCode = 404;
      throw error;
    }

    // 3. Validation
    const validation = updatestoreSchema.safeParse({ data: datatoupdate });
    if (!validation.success) {
      const error = new Error("Validation failed") as Error & {
        statusCode?: number;
        details?: unknown;
      };
      error.statusCode = 400;
      error.details = validation.error.format();
      throw error;
    }

    const dataToUpdate = validation.data.data;

    if (Object.keys(dataToUpdate).length === 0) {
      const error = new Error(
        "No valid fields provided for update",
      ) as Error & { statusCode?: number };
      error.statusCode = 400;
      throw error;
    }

    // 4. Uniqueness Checks
    if (dataToUpdate.subdomain && dataToUpdate.subdomain !== store.subdomain) {
      const existingSubdomain = await prisma.store.findUnique({
        where: { subdomain: dataToUpdate.subdomain },
        select: { id: true },
      });

      if (existingSubdomain && existingSubdomain.id !== store.id) {
        const error = new Error("Subdomain already exists") as Error & {
          statusCode?: number;
        };
        error.statusCode = 409;
        throw error;
      }
    }

    if (dataToUpdate.name && dataToUpdate.name !== store.name) {
      const existingStoreName = await prisma.store.findUnique({
        where: { name: dataToUpdate.name },
        select: { id: true },
      });

      if (existingStoreName && existingStoreName.id !== store.id) {
        const error = new Error("Store name already exists") as Error & {
          statusCode?: number;
        };
        error.statusCode = 409;
        throw error;
      }
    }

    // 5. Apply Updates (Prisma ignores undefined values automatically)
    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: {
        name: dataToUpdate.name,
        subdomain: dataToUpdate.subdomain,
        description: dataToUpdate.description,
        coverBannerUrl: dataToUpdate.coverBannerUrl,
        businessAddress: dataToUpdate.businessAddress,
        vatNumber: dataToUpdate.vatNumber,
        themeSettings: dataToUpdate.themeSettings,
        supportEmail: dataToUpdate.supportEmail,
        phoneNumber: dataToUpdate.phoneNumber,
        operatingHours: dataToUpdate.operatingHours,
        socialMediaLinks: dataToUpdate.socialMediaLinks,
      },
    });

    return updatedStore;
  }

  // async deleteStore()
  // soft deleteStore
  async deleteStore(userId: string) {
    const owner = await this.getUserwithStores(userId);

    if (!owner) {
      const error = new Error("User not found") as Error & {
        statusCode?: number;
      };
      error.statusCode = 404;
      throw error;
    }

    const store = owner.ownedStores;

    if (!store) {
      const error = new Error("Store not found") as Error & {
        statusCode?: number;
      };
      error.statusCode = 404;
      throw error;
    }

    const deletedStore = await prisma.store.update({
      where: { id: store.id },
      data: { deletedAt: new Date() },
    });

    return deletedStore;
  }
}

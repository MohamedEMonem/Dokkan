import {
  updatestoreSchema,
  type CreateStoreDto,
  type ListStoresQueryDto,
  type updateStoreDto,
} from "../DTO/store.dto.js";
import prisma from "../config/db.js";
import { Prisma, type StoreStatus } from "@prisma/client";

export class StoreServices {
  async createStore(dto: CreateStoreDto, ownerId: string) {
    const existingOwnerStore = await prisma.store.findUnique({
      where: { ownerId },
      select: { id: true },
    });

    if (existingOwnerStore) {
      const error = new Error("Owner already has a store") as Error & {
        statusCode?: number;
      };
      error.statusCode = 409;
      throw error;
    }

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

    try {
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const conflict = new Error("Owner already has a store") as Error & {
          statusCode?: number;
        };
        conflict.statusCode = 409;
        throw conflict;
      }

      throw error;
    }
  }

  async getOwnerStore(ownerId: string) {
    const store = await prisma.store.findUnique({
      where: { ownerId },
      select: {
        id: true,
        ownerId: true,
        name: true,
        subdomain: true,
        status: true,
        description: true,
        logoUrl: true,
        coverBannerUrl: true,
        businessAddress: true,
        vatNumber: true,
        phoneNumber: true,
        themeSettings: true,
        createdAt: true,
        deletedAt: true,
      },
    });

    return store;
  }

  async listStores(query: ListStoresQueryDto) {
    const { page, limit, status, sortBy, sortDir } = query;
    const skip = (page - 1) * limit;
    const storeStatus: StoreStatus = status ?? "Active";
    const where = {
      deletedAt: null,
      status: storeStatus,
    };

    const orderBy = {
      [sortBy]: sortDir,
    } as Prisma.StoreOrderByWithRelationInput;

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
          name: true,
          subdomain: true,
          description: true,
          logoUrl: true,
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

  async updateStore(userId: string, datatoupdate: updateStoreDto) {
    const store = await this.getOwnerStore(userId);

    if (!store) {
      const error = new Error("Store not found") as Error & {
        statusCode?: number;
      };
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
        logoUrl: dataToUpdate.logoUrl,
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
    const store = await this.getOwnerStore(userId);

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

import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../config/db.js";
import { sendError, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js";
import { deletePublicImg, uploadPublicImg } from "../services/imgStorageService.js";
import { listProductsQuerySchema } from "../DTO/product.dto.js";
const mapProduct = (product: { price: unknown; [key: string]: unknown }) => ({
  ...product,
  price: Number(product.price),
});

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedQuery = listProductsQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      return sendError(res, "Invalid query parameters", 400, parsedQuery.error.flatten());
    }

    const { page, limit, status, sortBy, sortDir, storeId } = parsedQuery.data;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(status ? { status } : {}),
      ...(storeId ? { storeId } : {}),
    };

    const orderBy = {
      [sortBy]: sortDir,
    } as Prisma.ProductOrderByWithRelationInput;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { images: true, store: true },
      }),
      prisma.product.count({ where }),
    ]);

    return sendSuccess(
      res,
      {
        products: products.map(mapProduct),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Products retrieved successfully",
    );
  } catch (error) {
    return next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Product id is required", 400);
    }

    const product = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: { images: true, store: true },
    });

    if (!product) {
      return sendNotFound(res, "Product not found");
    }

    return sendSuccess(res, mapProduct(product), "Product retrieved successfully");
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { storeId, categoryId, title, description, price, stockQuantity, status } = req.body;

    if (!storeId || !categoryId || !title || price === undefined) {
      return sendError(res, "storeId, categoryId, title and price are required", 400);
    }

    const numericPrice = Number(price);
    const numericStock = stockQuantity === undefined ? 0 : Number(stockQuantity);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return sendError(res, "price must be a non-negative number", 400);
    }

    if (!Number.isInteger(numericStock) || numericStock < 0) {
      return sendError(res, "stockQuantity must be a non-negative integer", 400);
    }

    let imgUrl: string | null = null;
    if (req.file) {
      const clientEmail = req.user?.email ?? "unknown";
      const clientRole = req.user?.role ?? "user";
      const subFolder = String(categoryId);
      const file = req.file;
      imgUrl = await uploadPublicImg(file, clientEmail, clientRole, subFolder);
    }

    try {
      const product = await prisma.product.create({
        data: {
          storeId,
          categoryId,
          title,
          description: description ?? null,
          price: numericPrice,
          stockQuantity: numericStock,
          status: status ?? "Active",
          images: imgUrl? {
            create: { imageUrl: imgUrl},
          }: undefined,

        },
        include: { images: true },
      });

      return sendSuccess(res, mapProduct(product), "Product created successfully", 201);
    } catch (dbError) {
      if (imgUrl) {
        try {
          await deletePublicImg(imgUrl);
        } catch (cleanupError) {
          console.warn("Failed to cleanup uploaded product image after DB error", cleanupError);
        }
      }
      throw dbError;
    }
  } catch (error) {
    return next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Product id is required", 400);
    }

    const existing = await prisma.product.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      return sendNotFound(res, "Product not found");
    }

    const data: Record<string, unknown> = {};
    if (req.body.title !== undefined) data.title = req.body.title;
    if (req.body.description !== undefined) data.description = req.body.description;
    if (req.body.categoryId !== undefined) data.categoryId = req.body.categoryId;
    if (req.body.status !== undefined) data.status = req.body.status;
    if (req.body.price !== undefined) {
      const numericPrice = Number(req.body.price);
      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        return sendError(res, "price must be a non-negative number", 400);
      }
      data.price = numericPrice;
    }
    if (req.body.stockQuantity !== undefined) {
      const numericStock = Number(req.body.stockQuantity);
      if (!Number.isInteger(numericStock) || numericStock < 0) {
        return sendError(res, "stockQuantity must be a non-negative integer", 400);
      }
      data.stockQuantity = numericStock;
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
      include: { images: true },
    });

    return sendSuccess(res, mapProduct(updated), "Product updated successfully");
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Product id is required", 400);
    }

    const existing = await prisma.product.findFirst({ where: { id, deletedAt: null },
     include: { images: true } }
      
    );
    if (!existing) {
      return sendNotFound(res, "Product not found");
    }
    await deletePublicImg(existing.images[0]?.imageUrl);
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return sendSuccess(res, null, "Product deleted successfully");
  } catch (error) {
    return next(error);
  }
};
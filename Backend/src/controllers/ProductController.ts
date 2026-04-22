import type { Request, Response } from "express";
import prisma from "../config/db.js";
import { sendError, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js";

const mapProduct = (product: { price: unknown; [key: string]: unknown }) => ({
  ...product,
  price: Number(product.price),
});

export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, products.map(mapProduct), "Products retrieved successfully");
  } catch (error) {
    return sendServerError(res, "Failed to retrieve products", error);
  }
};

export const getProductById = async (req: Request, res: Response) => {
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
    });

    if (!product) {
      return sendNotFound(res, "Product not found");
    }

    return sendSuccess(res, mapProduct(product), "Product retrieved successfully");
  } catch (error) {
    return sendServerError(res, "Failed to retrieve product", error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
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

    const product = await prisma.product.create({
      data: {
        storeId,
        categoryId,
        title,
        description: description ?? null,
        price: numericPrice,
        stockQuantity: numericStock,
        status: status ?? "Active",
      },
    });

    return sendSuccess(res, mapProduct(product), "Product created successfully", 201);
  } catch (error) {
    return sendServerError(res, "Failed to create product", error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
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
    });

    return sendSuccess(res, mapProduct(updated), "Product updated successfully");
  } catch (error) {
    return sendServerError(res, "Failed to update product", error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return sendError(res, "Product id is required", 400);
    }

    const existing = await prisma.product.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      return sendNotFound(res, "Product not found");
    }

    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return sendSuccess(res, null, "Product deleted successfully");
  } catch (error) {
    return sendServerError(res, "Failed to delete product", error);
  }
};
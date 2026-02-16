const prisma = require("../prisma/client");
const { z } = require("zod");
const { sendSuccess, sendError, sendServerError, sendForbidden } = require("../utils/response");

const productSchema = z.object({
    title: z.string().min(1).max(150),
    description: z.string().optional(),
    price: z.number().positive("Price must be greater than zero"),
    categoryId: z.number().int(),
    storeId: z.number().int(),
    stockQuantity: z.number().int().min(0).optional(),
});

const updateProductSchema = productSchema.partial();

const verifyStoreAccess = async (user, storeId) => {
    if (user.role === "Admin") return true;

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new Error("NOT_FOUND");
    
    if (store.ownerId === user.id) return true;

    // Check if user is a store employee
    const employeeRecord = await prisma.storeEmployee.findUnique({
        where: {
            userId_storeId: { userId: user.id, storeId: storeId }
        }
    });

    if (!employeeRecord) throw new Error("FORBIDDEN");
    
    return true;
};

// GET /api/products
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, store_id } = req.query;
        
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const whereClause = { deletedAt: null };
        if (store_id) {
            whereClause.storeId = Number(store_id);
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            skip,
            take,
            include: { images: true }
        });

        const totalCount = await prisma.product.count({ where: whereClause });

        const meta = {
            total: totalCount,
            page: Number(page),
            limit: take,
            totalPages: Math.ceil(totalCount / take)
        };

        return sendSuccess(res, { products, meta }, "Products retrieved successfully", 200);
    } catch (error) {
        return sendServerError(res, "Failed to fetch products", error);
    }
};

// POST /api/products
const createProduct = async (req, res) => {
    try {
        const validation = productSchema.safeParse(req.body);
        if (!validation.success) {
            return sendError(res, "Validation failed", 400, validation.error.format());
        }
        
        const parsedData = validation.data;

        await verifyStoreAccess(req.user, parsedData.storeId);

        const newProduct = await prisma.product.create({
            data: parsedData
        });

        return sendSuccess(res, newProduct, "Product created successfully", 201);
    } catch (error) {
        if (error.message === "FORBIDDEN") return sendForbidden(res, "You do not have permission to add products to this store.");
        if (error.message === "NOT_FOUND") return sendError(res, "Store not found.", 404);
        return sendServerError(res, "Failed to create product", error);
    }
};

// PATCH /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const productId = Number(req.params.id);
        
        const validation = updateProductSchema.safeParse(req.body);
        if (!validation.success) {
            return sendError(res, "Validation failed", 400, validation.error.format());
        }

        const parsedData = validation.data;

        const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
        if (!existingProduct || existingProduct.deletedAt) {
            return sendError(res, "Product not found", 404);
        }

        await verifyStoreAccess(req.user, existingProduct.storeId);

        if (parsedData.storeId && parsedData.storeId !== existingProduct.storeId) {
            await verifyStoreAccess(req.user, parsedData.storeId);
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: parsedData
        });

        return sendSuccess(res, updatedProduct, "Product updated successfully", 200);
    } catch (error) {
        if (error.message === "FORBIDDEN") return sendForbidden(res, "You do not have permission to edit this product.");
        if (error.message === "NOT_FOUND") return sendError(res, "Store not found.", 404);
        return sendServerError(res, "Failed to update product", error);
    }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const productId = Number(req.params.id);

        const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
        if (!existingProduct || existingProduct.deletedAt) {
            return sendError(res, "Product not found", 404);
        }

        await verifyStoreAccess(req.user, existingProduct.storeId);

        await prisma.product.update({
            where: { id: productId },
            data: { deletedAt: new Date() }
        });

        return sendSuccess(res, null, "Product deleted successfully", 200); 
    } catch (error) {
        if (error.message === "FORBIDDEN") return sendForbidden(res, "You do not have permission to delete this product.");
        return sendServerError(res, "Failed to delete product", error);
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};

/*
API Body:
- GET /api/products: None. Query parameters for pagination (page, limit) and optional store_id to filter by store.
- POST /api/products: { title, description, price, categoryId, storeId, stockQuantity }.
- PATCH /api/products/:id: Any subset of { title, description, price, categoryId, storeId, stockQuantity }.
- DELETE /api/products/:id: None.
*/
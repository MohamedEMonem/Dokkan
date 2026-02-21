const prisma = require("../prisma/client");
const { z, object } = require("zod");
const {
  sendSuccess,
  sendError,
  sendServerError,
  sendForbidden,
  sendNotFound,
  sendValidationError,
} = require("../utils/response");
const { productImgUploadHandler } = require("./uploadController");


const productSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().optional(),
  // price: z.string().min(1).max(150),
  // categoryId: z.string().min(1).max(150),
  // storeId: z.string().min(1).max(150),
  // stockQuantity: z.string().min(1).max(150).optional(),
  // imageUrl: z.string().url("Invalid image URL").optional(),

  price: z.coerce.number().positive("Price must be greater than zero"),
  categoryId: z.coerce.number().int(),
  storeId: z.coerce.number().int(),
  stockQuantity: z.coerce.number().int().min(0).optional(),
  images: z.array(z.object({
    imageUrl: z.string().url("Invalid image URL"),
    sortOrder: z.number().int().optional().default(0),
  })).optional(),
  objectName: z.string().optional()
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
      userId_storeId: { userId: user.id, storeId: storeId },
    },
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
      include: { images: true },
    });

    const totalCount = await prisma.product.count({ where: whereClause });

    const meta = {
      total: totalCount,
      page: Number(page),
      limit: take,
      totalPages: Math.ceil(totalCount / take),
    };

    return sendSuccess(
      res,
      { products, meta },
      "Products retrieved successfully",
      200,
    );
  } catch (error) {
    return sendServerError(res, "Failed to fetch products", error);
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {

    console.log("1. Did Multer find a file?", req.file ? "YES" : "NO");
    console.log("2. Did Middleware attach images?", req.images ? "YES" : "NO");
    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const {...parsedData} = validation.data;
    // const {...parsedData} = req.body;
    let uploadResult = undefined;
    if (req.images && req.images.length > 0) {
      uploadResult = {
        imageUrl: req.images[0].imageUrl,
        objectName: req.uploadedObjectName,
      };
    }
    // await verifyStoreAccess(req.user, parsedData.storeId); /// temporarily disabled for testing without auth

     const newProduct = await prisma.product.create({
      data: {...parsedData, images: uploadResult ? { create: [{ imageUrl: uploadResult.imageUrl, sortOrder: 0 }] } : undefined },
      include: { images: true }
    });

    // const newProduct = await prisma.product.create({
    //   data: {
    //     title: parsedData.title,
    //     description: parsedData.description,
    //     price: parseFloat(parsedData.price),
    //     categoryId: parseInt(parsedData.categoryId),
    //     storeId: parseInt(parsedData.storeId),
    //     stockQuantity: parsedData.stockQuantity ? parseInt(parsedData.stockQuantity) : undefined,
    //     images: uploadResult ? { create: [{ imageUrl: uploadResult.imageUrl, sortOrder }] } : undefined
    //   },
    //   include: { images: true }
    // });

    return sendSuccess(res, newProduct, "Product created successfully", 201);
  } catch (error) {
    if (error.message === "FORBIDDEN")
      return sendForbidden(
        res,
        "You do not have permission to add products to this store.",
      );
    if (error.message === "NOT_FOUND")
      return sendError(res, "Store not found.");
    return sendServerError(res, "Failed to create product", error);
  }
};

// PATCH /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const validation = updateProductSchema.safeParse(req.body);
    if (!validation.success) {
      return sendValidationError(res, validation.error.format());
    }

    const {images, ...parsedData} = validation.data;

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true }
    });
    if (!existingProduct || existingProduct.deletedAt) {
      return sendNotFound(res, "Product not found");
    }

    await verifyStoreAccess(req.user, existingProduct.storeId);

    if (parsedData.storeId && parsedData.storeId !== existingProduct.storeId) {
      await verifyStoreAccess(req.user, parsedData.storeId);
    }

    const updatedPayload = { ...parsedData };

    if (images) {
      updatedPayload.images = {deleteMany: {imageUrl: { in: existingProduct.images.map(img => img.imageUrl) }}, create: images };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updatedPayload,
      include: { images: true }
    });

    return sendSuccess(
      res,
      updatedProduct,
      "Product updated successfully",
      200,
    );
  } catch (error) {
    if (error.message === "FORBIDDEN")
      return sendForbidden(
        res,
        "You do not have permission to edit this product.",
      );
    if (error.message === "NOT_FOUND")
      return sendError(res, "Store not found.");
    return sendServerError(res, "Failed to update product", error);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct || existingProduct.deletedAt) {
      return sendNotFound(res, "Product not found");
    }

    await verifyStoreAccess(req.user, existingProduct.storeId);

    await prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() },
    });

    return sendSuccess(res, null, "Product deleted successfully");
  } catch (error) {
    if (error.message === "FORBIDDEN")
      return sendForbidden(
        res,
        "You do not have permission to delete this product.",
      );
    return sendServerError(res, "Failed to delete product", error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

/*
API Body:
- GET /api/products: None. Query parameters for pagination (page, limit) and optional store_id to filter by store.
- POST /api/products: { title, description, price, categoryId, storeId, stockQuantity }.
- PATCH /api/products/:id: Any subset of { title, description, price, categoryId, storeId, stockQuantity }.
- DELETE /api/products/:id: None.
*/

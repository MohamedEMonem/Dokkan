// const prisma = require("../prisma/client");
// const { z } = require("zod");
// const { sendSuccess, sendError, sendServerError, sendNotFound, sendValidationError } = require("../utils/response");

// const categorySchema = z.object({
//     name: z.string().min(1).max(100),
//     parentCategoryId: z.number().int().nullable().optional(),
// });

// const updateCategorySchema = categorySchema.partial();
//  // GET /api/categories
// const getCategories = async (req, res) => {
//     try {
//         const categories = await prisma.category.findMany({
//             where: {
//                 parentCategoryId: null
//             },
//             include: {
//                 children: {
//                     include: {
//                         children: true
//                     }
//                 }
//             }
//         });

//         return sendSuccess(res, categories, "Categories retrieved successfully");
//     } catch (error) {
//         return sendServerError(res, "Failed to fetch categories", error);
//     }
// };

// // POST /api/categories
// const createCategory = async (req, res) => {
//     try {
//         const validation = categorySchema.safeParse(req.body);
//         if (!validation.success) {
//             return sendValidationError(res, validation.error.format());
//         }

//         const { name, parentCategoryId } = validation.data;

//         if (parentCategoryId) {
//             const parentExists = await prisma.category.findUnique({
//                 where: { id: parentCategoryId }
//             });
//             if (!parentExists) {
//                 return sendError(res, "Parent category does not exist");
//             }
//         }

//         const newCategory = await prisma.category.create({
//             data: { name, parentCategoryId }
//         });

//         return sendSuccess(res, newCategory, "Category created successfully", 201);
//     } catch (error) {
//         return sendServerError(res, "Failed to create category", error);
//     }
// };

// //PATCH /api/categories/:id
// const updateCategory = async (req, res) => {
//     try {
//         const categoryId = Number(req.params.id);
        
//         const validation = updateCategorySchema.safeParse(req.body);
//         if (!validation.success) {
//             return sendValidationError(res, validation.error.format());
//         }

//         const { name, parentCategoryId } = validation.data;

//         const existingCategory = await prisma.category.findUnique({ where: { id: categoryId } });
//         if (!existingCategory) {
//             return sendNotFound(res, "Category not found");
//         }

//         if (parentCategoryId === categoryId) {
//             return sendError(res, "A category cannot be its own parent");
//         }

//         const updatedCategory = await prisma.category.update({
//             where: { id: categoryId },
//             data: { name, parentCategoryId }
//         });

//         return sendSuccess(res, updatedCategory, "Category updated successfully");
//     } catch (error) {
//         return sendServerError(res, "Failed to update category", error);
//     }
// };

// // DELETE /api/categories/:id
// const deleteCategory = async (req, res) => {
//     try {
//         const categoryId = Number(req.params.id);

//         const existingCategory = await prisma.category.findUnique({
//             where: { id: categoryId },
//             include: {
//                 children: true,
//                 _count: { select: { products: true } }
//             }
//         });

//         if (!existingCategory) {
//             return sendNotFound(res, "Category not found");
//         }

//         if (existingCategory.children.length > 0) {
//             return sendError(res, "Cannot delete category because it has sub-categories. Please reassign or delete them first.");
//         }

//         if (existingCategory._count.products > 0) {
//             return sendError(res, "Cannot delete category because there are products attached to it.");
//         }

//         await prisma.category.delete({
//             where: { id: categoryId }
//         });

//         return sendSuccess(res, null, "Category deleted successfully");
//     } catch (error) {
//         return sendServerError(res, "Failed to delete category", error);
//     }
// };

// module.exports = {
//     getCategories,
//     createCategory,
//     updateCategory,
//     deleteCategory
// };

// /*
// API Body:
// - GET /api/categories: None.
// - POST /api/categories: { name, parentCategoryId (optional) }.
// - PATCH /api/categories/:id: Any subset of { name, parentCategoryId }.
// - DELETE /api/categories/:id: None.
// */
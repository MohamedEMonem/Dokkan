import { useState, useMemo } from "react";
import clsx from "clsx";
import { Package, Plus, SquarePen, Trash2, Search, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@/utils/showNotification";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useGetProductsByStoreIdQuery, useDeleteProductMutation } from "@/api/product.api";
import { useGetUserStoreQuery } from "@/api/store.api";
import { sortBy } from "@/utils/sorting";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { IProduct } from "@/types/entities/product.types";
import { Pagination } from "@/components/ui/Pagination";

export function Products() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "asc" | "desc";
    type?: "number" | "date";
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setCurrentPage(1);
  }

  const { data: storeResponse, isLoading: isLoadingStore } = useGetUserStoreQuery();
  const storeId = storeResponse?.data?.store?.id || "";

  const { data: response, isLoading: isLoadingProducts } = useGetProductsByStoreIdQuery(storeId, {
    skip: !storeId,
  });

  const isLoading = isLoadingStore || isLoadingProducts;

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const products = response?.data?.products ?? [];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  const handleDeleteClick = (product: IProduct) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct({ id: productToDelete.id }).unwrap();
      showNotification({ 
        message: `${productToDelete.title}\nتم حذف المنتج بنجاح`, 
        variant: "success" 
      });
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      showNotification({ 
        message: `${productToDelete.title}\nفشل في حذف المنتج`, 
        variant: "error" 
      });
      console.error("Delete Error:", error);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const applySorting = (items: any[]) => {
    if (!sortConfig) return items;
    return [...items].sort(
      sortBy(sortConfig.key as any, sortConfig.order, sortConfig.type)
    );
  };

  const displayedProducts = useMemo(() => {
    return applySorting(filteredProducts);
  }, [filteredProducts, sortConfig]);

  const totalPages = Math.ceil(displayedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return displayedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [displayedProducts, currentPage]);

  const fromIndex = paginatedProducts.length ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const toIndex = (currentPage - 1) * ITEMS_PER_PAGE + paginatedProducts.length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSort = (key: string, type?: "number" | "date") => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, order: prev.order === "asc" ? "desc" : "asc", type };
      }
      return { key, order: "asc", type };
    });
  };

  const TABLE_HEADERS = [
    { label: "الصورة" },
    { label: "اسم المنتج", key: "title" },
    { label: "السعر", key: "price", type: "number" as const },
    { label: "المخزون", key: "stockQuantity", type: "number" as const },
    { label: "الحالة", key: "status" },
    { label: "إجراءات", className: "text-center" },
  ];

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      <DashboardCard
        title={`جميع المنتجات (${isLoading ? "..." : displayedProducts.length})`}
        icon={<Package className="w-6 h-6 text-primary" />}
        headerAction={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              className="w-auto! h-9! px-4 text-sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate("/dashboard/products/create")}
            >
              إضافة منتج
            </Button>
          </div>
        }
      >
        <div className="mb-8 max-w-md">
          <Input
            placeholder="بحث باسم المنتج..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 h-12"
          />
        </div>

        <div className="relative w-full overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="border-b-2 border-accent-light/50 text-text-dark font-bold">
                {TABLE_HEADERS.map((header, index) => (
                  <th
                    key={index}
                    className={clsx(
                      "pb-4 px-2 whitespace-nowrap group/header",
                      header.key && "cursor-pointer hover:text-primary transition-colors",
                      header.className
                    )}
                    onClick={() =>
                      header.key && handleSort(header.key, header.type)
                    }
                  >
                    <div
                      className={clsx(
                        "flex items-center gap-1",
                        header.className?.includes("text-center") && "justify-center"
                      )}
                    >
                      {header.label}
                      {header.key && (
                        <span className="text-accent-light group-hover/header:text-primary/50 transition-colors">
                          {sortConfig?.key === header.key ? (
                            sortConfig?.order === "asc" ? (
                              <ArrowUp className="w-3 h-3 text-primary" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-primary" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/header:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-light/30">
              {isLoading ? (
                <tr>
                  <td colSpan={TABLE_HEADERS.length} className="text-center py-4">جاري التحميل...</td>
                </tr>
              ) : displayedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={TABLE_HEADERS.length}
                    className="text-center py-8 text-text-muted"
                  >
                    {searchQuery
                      ? `لا يوجد نتائج للبحث عن "${searchQuery}"`
                      : "لا توجد منتجات حالياً"}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="group hover:bg-bg-cream/50 transition-colors"
                  >
                    <td className="py-4 px-2">
                      <div className="w-12 h-12 bg-bg-cream rounded-lg overflow-hidden border border-accent-light shadow-sm">
                        <img
                          src={product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-2 font-semibold text-text-dark">
                      {product.title}
                    </td>
                    <td className="py-4 px-2 text-primary font-bold">
                      {product.price} ج.م
                    </td>
                    <td className="py-4 px-2 text-text-muted">
                      {product.stockQuantity}
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={clsx(
                          "inline-flex items-center justify-center px-2.5 py-1 rounded-xl text-xs font-bold text-white transition-colors",
                          product.status === "Active" ? "bg-green-500" : "bg-gray-400 md:relative md:left-2"
                        )}
                      >
                        {product.status === "Active" ? "نشط" : "غير نشط"}
                      </span>
                    </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="tertiary"
                        className="size-9! p-0"
                        title="تعديل"
                        icon={<SquarePen className="w-4 h-4" />}
                        onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}
                      />
                      <Button
                        variant="tertiary"
                        className="size-9! p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                        title="حذف"
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => handleDeleteClick(product)}
                      />
                    </div>
                  </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-accent-light/30 pt-4" dir="rtl">
            <p className="text-gray-500 text-xs sm:text-sm">
              عرض {fromIndex}–{toIndex} من أصل {displayedProducts.length} منتج
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </DashboardCard>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        product={productToDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}

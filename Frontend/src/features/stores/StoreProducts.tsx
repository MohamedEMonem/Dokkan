import React, { useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Star, SlidersHorizontal } from "lucide-react";
import ErrorPage from "@/pages/ErrorPage";
import { ProductCard } from "@/features/products/components/ProductCard";
import { IProduct } from "@/types/entities/product.types";
import { EProductStatus } from "@/types/entities/product.types";

// Mock store data (same as StoreHome)
const MOCK_STORE = {
  id: "store-123",
  name: "متجر الأمل للملابس والأحذية",
  subdomain: "al-amal",
  description: "أحدث الموديلات العالمية بأفضل الأسعار وأعلى جودة. ملابس رجالية، نسائية، وأحذية تناسب جميع الأذواق.",
  logoUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  coverBannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  businessAddress: "١٢ شارع شهاب، المهندسين، الجيزة",
  supportEmail: "info@alamal-store.com",
  phoneNumber: "+201012345678",
  operatingHours: "يومياً من ١٠ صباحاً حتى ١١ مساءً",
  averageRating: 4.8,
  reviewCount: 312,
};

// Mock products data (same as StoreHome)
const MOCK_PRODUCTS: any[] = [
  // Subcategory 1: Clothes
  {
    id: "p1",
    title: "تيشيرت قطني كاجوال",
    price: 349.99,
    stockQuantity: 15,
    status: EProductStatus.Active,
    images: [
      {
        id: "img1",
        productId: "p1",
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
      }
    ],
    storeId: "store-123",
    subCategoryId: "subcat-clothes",
    categoryId: "cat-1",
    store: {
      id: "store-123",
      name: "متجر الأمل للملابس والأحذية",
      subdomain: "al-amal",
    },
    subCategory: {
      id: "subcat-clothes",
      name: "ملابس رجالية",
    }
  },
  {
    id: "p2",
    title: "قميص كلاسيك فاخر",
    price: 499.99,
    stockQuantity: 8,
    status: EProductStatus.Active,
    images: [
      {
        id: "img2",
        productId: "p2",
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
      }
    ],
    storeId: "store-123",
    subCategoryId: "subcat-clothes",
    categoryId: "cat-1",
    store: {
      id: "store-123",
      name: "متجر الأمل للملابس والأحذية",
      subdomain: "al-amal",
    },
    subCategory: {
      id: "subcat-clothes",
      name: "ملابس رجالية",
    }
  },
  {
    id: "p3",
    title: "بنطلون جينز عصري",
    price: 599.99,
    stockQuantity: 20,
    status: EProductStatus.Active,
    images: [
      {
        id: "img3",
        productId: "p3",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
      }
    ],
    storeId: "store-123",
    subCategoryId: "subcat-clothes",
    categoryId: "cat-1",
    store: {
      id: "store-123",
      name: "متجر الأمل للملابس والأحذية",
      subdomain: "al-amal",
    },
    subCategory: {
      id: "subcat-clothes",
      name: "ملابس رجالية",
    }
  },
  {
    id: "p4",
    title: "جاكيت شتوي أنيق",
    price: 1299.99,
    stockQuantity: 5,
    status: EProductStatus.Active,
    images: [
      {
        id: "img4",
        productId: "p4",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
      }
    ],
    storeId: "store-123",
    subCategoryId: "subcat-clothes",
    categoryId: "cat-1",
    store: {
      id: "store-123",
      name: "متجر الأمل للملابس والأحذية",
      subdomain: "al-amal",
    },
    subCategory: {
      id: "subcat-clothes",
      name: "ملابس رجالية",
    }
  },
  {
    id: "p5",
    title: "بليزر رجالي رسمي",
    price: 1899.99,
    stockQuantity: 3,
    status: EProductStatus.Active,
    images: [
      {
        id: "img5",
        productId: "p5",
        imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
      }
    ],
    storeId: "store-123",
    subCategoryId: "subcat-clothes",
    categoryId: "cat-1",
    store: {
      id: "store-123",
      name: "متجر الأمل للملابس والأحذية",
      subdomain: "al-amal",
    },
    subCategory: {
      id: "subcat-clothes",
      name: "ملابس رجالية",
    }
  },
  // Subcategory 2: Shoes
  {
    id: "p6",
    title: "حذاء رياضي مريح",
    price: 799.99,
    stockQuantity: 12,
    status: EProductStatus.Active,
    images: [
      {
        id: "img6",
        productId: "p6",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
      }
    ],
    storeId: "store-123",
    subCategoryId: "subcat-shoes",
    categoryId: "cat-1",
    store: {
      id: "store-123",
      name: "متجر الأمل للملابس والأحذية",
      subdomain: "al-amal",
    },
    subCategory: {
      id: "subcat-shoes",
      name: "أحذية رياضية",
    }
  },
  {
    id: "p7",
    title: "حذاء جري ديناميكي",
    price: 949.99,
    stockQuantity: 0,
    status: EProductStatus.Active,
    images: [
      {
        id: "img7",
        productId: "p7",
        imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
      }
    ],
    storeId: "store-123",
    subCategoryId: "subcat-shoes",
    categoryId: "cat-1",
    store: {
      id: "store-123",
      name: "متجر الأمل للملابس والأحذية",
      subdomain: "al-amal",
    },
    subCategory: {
      id: "subcat-shoes",
      name: "أحذية رياضية",
    }
  },
  {
    id: "p8",
    title: "حذاء كلاسيكي جلدي",
    price: 899.99,
    stockQuantity: 4,
    status: EProductStatus.Active,
    images: [
      {
        id: "img8",
        productId: "p8",
        imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
      }
    ],
    storeId: "store-123",
    subCategoryId: "subcat-shoes",
    categoryId: "cat-1",
    store: {
      id: "store-123",
      name: "متجر الأمل للملابس والأحذية",
      subdomain: "al-amal",
    },
    subCategory: {
      id: "subcat-shoes",
      name: "أحذية رياضية",
    }
  },
  {
    id: "p9",
    title: "سنيكرز عصري أبيض",
    price: 699.99,
    stockQuantity: 18,
    status: EProductStatus.Active,
    images: [
      {
        id: "img9",
        productId: "p9",
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500",
      }
    ],
    storeId: "store-123",
    subCategoryId: "subcat-shoes",
    categoryId: "cat-1",
    store: {
      id: "store-123",
      name: "متجر الأمل للملابس والأحذية",
      subdomain: "al-amal",
    },
    subCategory: {
      id: "subcat-shoes",
      name: "أحذية رياضية",
    }
  },
];

const StoreProducts: React.FC = () => {
  const { subdomain } = useParams<{ subdomain: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubcat = searchParams.get("subcat");

  // If the parameter doesn't exist or doesn't start with '@', treat it as a 404 page
  if (!subdomain || !subdomain.startsWith("@")) {
    return <ErrorPage />;
  }

  const cleanSubdomain = subdomain.slice(1);

  // In this demo stage, we use MOCK_STORE, but show the URL subdomain for visual validation
  const store = useMemo(() => {
    return {
      ...MOCK_STORE,
      subdomain: cleanSubdomain,
      name: cleanSubdomain ? `متجر ${cleanSubdomain}` : MOCK_STORE.name,
    };
  }, [cleanSubdomain]);

  // Extract unique subcategories from products list
  const subcategories = useMemo(() => {
    const map = new Map<string, string>();
    (MOCK_PRODUCTS as unknown as IProduct[]).forEach((p) => {
      const subCat = (p as any).subCategory;
      if (subCat) {
        map.set(subCat.id, subCat.name);
      }
    });

    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // Filter products based on search parameter
  const filteredProducts = useMemo(() => {
    const allProducts = MOCK_PRODUCTS as unknown as IProduct[];
    if (!activeSubcat) return allProducts;

    return allProducts.filter((p) => p.subCategoryId === activeSubcat);
  }, [activeSubcat]);

  const handleSubcatClick = (id: string | null) => {
    if (id) {
      setSearchParams({ subcat: id });
    } else {
      searchParams.delete("subcat");
      setSearchParams(searchParams);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16" dir="rtl">
      {/* Mini Banner Header */}
      <div className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-right">
            <Link
              to={`/${subdomain}`}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="العودة للمتجر"
            >
              <ArrowRight size={20} className="text-text-dark" />
            </Link>
            <div className="size-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-white shrink-0">
              <img
                src={store.logoUrl}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-dark flex items-center gap-2">
                <span>{store.name}</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-medium">
                  المنتجات
                </span>
              </h1>
              <p className="text-xs text-text-muted mt-0.5 max-w-md line-clamp-1">
                {store.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 shrink-0">
            <span className="text-text-dark font-bold">{store.averageRating}</span>
            <Star size={14} className="text-accent fill-currentColor" />
            <span className="text-text-muted">({store.reviewCount} تقييم)</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Subcategories Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 shrink-0 text-right">
            <h3 className="text-base font-bold text-text-dark mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-primary" />
              <span>الأقسام الفرعية</span>
            </h3>
            <ul className="flex flex-col gap-1.5">
              <li>
                <button
                  onClick={() => handleSubcatClick(null)}
                  className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    !activeSubcat
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-text-muted hover:bg-gray-50 hover:text-text-dark"
                  }`}
                >
                  جميع المنتجات
                </button>
              </li>
              {subcategories.map((sub) => (
                <li key={sub.id}>
                  <button
                    onClick={() => handleSubcatClick(sub.id)}
                    className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeSubcat === sub.id
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-text-muted hover:bg-gray-50 hover:text-text-dark"
                    }`}
                  >
                    {sub.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Subcategories Filter - Mobile horizontal scroll */}
          <div className="lg:hidden w-full overflow-x-auto pb-4 scrollbar-none flex gap-2 snap-x snap-mandatory">
            <button
              onClick={() => handleSubcatClick(null)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap snap-start border transition-all ${
                !activeSubcat
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-text-muted border-gray-200"
              }`}
            >
              جميع المنتجات
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubcatClick(sub.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap snap-start border transition-all ${
                  activeSubcat === sub.id
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-text-muted border-gray-200"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="flex-1 w-full">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                <p className="text-text-muted text-base mb-4">
                  لا توجد منتجات متوفرة في هذا القسم حالياً.
                </p>
                <button
                  onClick={() => handleSubcatClick(null)}
                  className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
                >
                  عرض جميع المنتجات
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreProducts;

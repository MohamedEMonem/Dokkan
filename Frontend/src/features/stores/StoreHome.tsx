import React, { useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Mail,
  Phone,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ErrorPage from "@/pages/ErrorPage";
import { ProductCard } from "@/features/products/components/ProductCard";
import { IProduct } from "@/types/entities/product.types";
import { EProductStatus } from "@/types/entities/product.types";

// Mock store data
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

// Mock products data matching IProduct structure
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
    stockQuantity: 0, // Out of stock to test badge
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
    stockQuantity: 4, // Low stock to test badge
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

interface ProductSliderProps {
  products: IProduct[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth;
      const scrollDirectionMultiplier = direction === "left" ? -1 : 1;
      sliderRef.current.scrollBy({
        left: scrollAmount * scrollDirectionMultiplier,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Scrollable Container */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory gap-6 pb-4 pt-1"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[280px] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Control Buttons */}
      {products.length > 4 && (
        <>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-6 z-10 size-12 bg-white border border-gray-100 rounded-full shadow-lg items-center justify-center hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all text-text-dark"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-6 z-10 size-12 bg-white border border-gray-100 rounded-full shadow-lg items-center justify-center hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all text-text-dark"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        </>
      )}
    </div>
  );
};

const StoreHome: React.FC = () => {
  const { subdomain } = useParams<{ subdomain: string }>();

  // If the parameter doesn't exist or doesn't start with '@', treat it as a 404 page
  if (!subdomain || !subdomain.startsWith("@")) {
    return <ErrorPage />;
  }

  // Extract the subdomain (slice off the '@' prefix)
  const cleanSubdomain = subdomain.slice(1);

  // In this demo stage, we use MOCK_STORE, but show the URL subdomain for visual validation
  const store = useMemo(() => {
    return {
      ...MOCK_STORE,
      subdomain: cleanSubdomain,
      name: cleanSubdomain ? `متجر ${cleanSubdomain}` : MOCK_STORE.name,
    };
  }, [cleanSubdomain]);

  // Group products by subcategory
  const groupedProducts = useMemo(() => {
    const groups: Record<
      string,
      { id: string; name: string; products: IProduct[] }
    > = {};

    (MOCK_PRODUCTS as unknown as IProduct[]).forEach((product) => {
      const subCat = (product as any).subCategory;
      if (subCat) {
        if (!groups[subCat.id]) {
          groups[subCat.id] = {
            id: subCat.id,
            name: subCat.name,
            products: [],
          };
        }
        groups[subCat.id].products.push(product);
      }
    });

    return Object.values(groups);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-16" dir="rtl">
      {/* Store Banner */}
      <div className="h-64 sm:h-80 w-full relative overflow-hidden bg-gray-200">
        <img
          src={store.coverBannerUrl}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Store Header Info */}
      <div className="container mx-auto px-4 -mt-16 sm:-mt-24 relative z-10 mb-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-right">
            {/* Logo */}
            <div className="size-24 sm:size-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white shrink-0">
              <img
                src={store.logoUrl}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 pt-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-dark">
                  {store.name}
                </h1>
                <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-100">
                  نشط
                </span>
              </div>
              <p className="text-text-muted text-sm sm:text-base max-w-2xl mb-4 leading-relaxed">
                {store.description}
              </p>

              {/* Rating */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm">
                <span className="text-text-dark font-bold">{store.averageRating}</span>
                <div className="flex items-center text-accent">
                  <Star size={16} fill="currentColor" className="text-accent" />
                </div>
                <span className="text-text-muted">({store.reviewCount} تقييم)</span>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="border-t md:border-t-0 md:border-r border-gray-100 pt-6 md:pt-0 md:pr-8 flex flex-col gap-3.5 text-sm text-text-muted shrink-0 min-w-[280px]">
            <div className="flex items-center gap-3 justify-start">
              <MapPin size={18} className="text-primary shrink-0" />
              <span>{store.businessAddress}</span>
            </div>
            <div className="flex items-center gap-3 justify-start">
              <Phone size={18} className="text-primary shrink-0" />
              <span dir="ltr">{store.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-3 justify-start">
              <Mail size={18} className="text-primary shrink-0" />
              <span>{store.supportEmail}</span>
            </div>
            <div className="flex items-center gap-3 justify-start">
              <Clock size={18} className="text-primary shrink-0" />
              <span>{store.operatingHours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategory Sections */}
      <div className="container mx-auto px-4 flex flex-col gap-12">
        {groupedProducts.map((group) => (
          <section key={group.id} className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
              <Link
                to={`/@${store.subdomain}/products?subcat=${group.id}`}
                className="group flex items-center gap-2 hover:text-primary transition-colors text-right"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-text-dark group-hover:text-primary transition-colors">
                  {group.name}
                </h2>
                <ChevronLeft size={20} className="text-text-muted group-hover:text-primary group-hover:-translate-x-1 transition-all" />
              </Link>
              <Link
                to={`/@${store.subdomain}/products?subcat=${group.id}`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                عرض الكل
              </Link>
            </div>

            {/* Slider */}
            <ProductSlider products={group.products} />
          </section>
        ))}
      </div>
    </div>
  );
};

export default StoreHome;

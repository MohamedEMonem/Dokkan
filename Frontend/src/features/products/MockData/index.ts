import { IReview } from "@/types/entities/review.types";
import { EProductStatus, IProduct } from "@/types/entities/product.types";

/* ────────────────────────────────────────────────────────
 * Mock Reviews Data
 * ──────────────────────────────────────────────────────── */

export const mockReviewsData: IReview[] = [
  {
    id: "review-1",
    productId: "prod-e14",
    customerId: "cust-001",
    orderId: "order-101",
    rating: 5,
    reviewText:
      "منتج ممتاز جداً! الجودة عالية جداً والتسليم كان سريع. أنصح به بشدة.",
    storeResponse: "شكراً لك على تقييمك الرائع! نسعد بخدمتك مجدداً.",
    createdAt: new Date("2024-04-15"),
    updatedAt: new Date("2024-04-15"),
  },
  {
    id: "review-2",
    productId: "prod-e14",
    customerId: "cust-002",
    orderId: "order-102",
    rating: 4,
    reviewText: "جيد جداً لكن الحزمة تأخرت قليلاً. المنتج وصل بحالة ممتازة.",
    storeResponse: undefined,
    createdAt: new Date("2024-04-10"),
    updatedAt: new Date("2024-04-10"),
  },
  {
    id: "review-3",
    productId: "prod-e14",
    customerId: "cust-003",
    orderId: "order-103",
    rating: 5,
    reviewText: "ممتاز! بالضبط كما هو موضح في الصورة. شكراً لكم.",
    storeResponse: "شكراً على ثقتك بنا! نتطلع لخدمتك مرة أخرى.",
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date("2024-04-05"),
  },
  {
    id: "review-4",
    productId: "prod-e14",
    customerId: "cust-004",
    orderId: "order-104",
    rating: 3,
    reviewText: "عادي. المنتج جيد لكن السعر غالي قليلاً.",
    storeResponse: "نشكرك على ملاحظتك. سنحاول تحسين الأسعار.",
    createdAt: new Date("2024-03-30"),
    updatedAt: new Date("2024-03-30"),
  },
  {
    id: "review-5",
    productId: "prod-e14",
    customerId: "cust-005",
    orderId: "order-105",
    rating: 5,
    reviewText: "خدمة توصيل ممتازة والمنتج أفضل من التوقعات. شكراً على كل شيء!",
    storeResponse: undefined,
    createdAt: new Date("2024-03-25"),
    updatedAt: new Date("2024-03-25"),
  },
  {
    id: "review-6",
    productId: "prod-e14",
    customerId: "cust-006",
    orderId: "order-106",
    rating: 4,
    reviewText: "منتج جودته عالية وأسعاره معقول. أنصح به.",
    storeResponse: "شكراً على تقييمك! نتمنى رؤيتك قريباً.",
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-03-20"),
  },
];

/* ────────────────────────────────────────────────────────
 * Mock Product Data with Reviews
 * ──────────────────────────────────────────────────────── */

export const mockProductWithReviews: IProduct & { reviews: IReview[] } = {
  id: "prod-e14",
  storeId: "store-001",
  categoryId: "cat-electronics",
  title: "منتج إلكترونيات عالي الجودة",
  description:
    "USB 3.0، نقل سريع، تصميم مدمج ومقاوم للصدمات. منتج موثوق وعملي.",
  price: 250,
  stockQuantity: 47,
  status: EProductStatus.Active,
  images: [
    {
      id: "img-1",
      productId: "prod-e14",
      imageUrl:
        "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
      sortOrder: 1,
    },
  ],
  reviews: mockReviewsData,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-15"),
};

/* ────────────────────────────────────────────────────────
 * Helper Functions
 * ──────────────────────────────────────────────────────── */

/**
 * Calculate average rating from reviews
 */
export const calculateAverageRating = (reviews: IReview[]): number => {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
};

/**
 * Get rating distribution count
 */
export const getRatingDistribution = (
  reviews: IReview[],
): Record<number, number> => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    distribution[review.rating as keyof typeof distribution]++;
  });
  return distribution;
};

/**
 * Format review date
 */
export const formatReviewDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "اليوم";
  if (diffDays === 1) return "أمس";
  if (diffDays < 30) return `قبل ${diffDays} يوم`;
  if (diffDays < 365) return `قبل ${Math.floor(diffDays / 30)} شهر`;
  return `قبل ${Math.floor(diffDays / 365)} سنة`;
};

/* ────────────────────────────────────────────────────────
 * Related Products Mock Data
 * ──────────────────────────────────────────────────────── */

export type RelatedProductItem = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
};

export const mockRelatedProducts: RelatedProductItem[] = [
  {
    id: "prod-1",
    title: "سماعات لاسلكية بخاصية إلغاء الضوضاء",
    price: 299.99,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "prod-2",
    title: "ماوس ألعاب RGB لاسلكي",
    price: 189.0,
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "prod-3",
    title: "لوحة مفاتيح ميكانيكية بإضاءة خلفية",
    price: 459.5,
    imageUrl:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "prod-4",
    title: "حامل لابتوب قابل للتعديل",
    price: 149.75,
    imageUrl:
      "https://images.unsplash.com/photo-1640955014216-75201056c829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3B8ZW58MXx8fHwxNzYyMDk4NzM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

/* ────────────────────────────────────────────────────────
 * Shipping Info Mock Data
 * ──────────────────────────────────────────────────────── */

export const mockShippingInfo = {
  standardShipping: "5-7",
  expressShipping: "2-3",
  freeShippingThreshold: 500,
  returnPolicyDays: 30,
};

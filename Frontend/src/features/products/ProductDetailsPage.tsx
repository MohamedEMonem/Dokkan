import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "@/api/product.api";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { Store, Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { showNotification } from "@/utils/showNotification";
import { useAppDispatch } from "@/store/hooks";
import { useAddItemMutation } from "@/api/cart.api";
import { addItemToCart } from "@/features/cart/logic/cartService";
import { store } from "@/store/store";
import {
  mockReviewsData,
  mockRelatedProducts,
  mockShippingInfo,
} from "./MockData";
import ReviewCard from "./components/ReviewCard";
import { Card } from "@/components/ui/Card";
import { Stars } from "./components/Stars";
import { readSession } from "../cart/hooks/useCartSession";

export function ProductDetailsPage() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState<number>(1);
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "shipping"
  >("shipping");
  const { isAuthenticated } = readSession();
  const { data, isLoading, isError } = useGetProductByIdQuery(
    { id: id ?? "" },
    { skip: !id },
  );

  const dispatch = useAppDispatch();
  const [addItemApi] = useAddItemMutation();

  useEffect(() => {
    if (data?.data) {
      if (data.data.stockQuantity <= 0) {
        setTimeout(() => setCartCount(0), 0);
      } else if (cartCount <= 0) {
        setTimeout(() => setCartCount(1), 0);
      } else if (cartCount > data.data.stockQuantity) {
        setTimeout(() => setCartCount(data.data.stockQuantity), 0);
      }
    }
  }, [data, cartCount]);

  const productReviews = 187; // mock number, replace with actual count from API when available

  const TABS = [
    { id: "shipping", label: "معلومات الشحن" },
    { id: "reviews", label: `التقييمات (${productReviews})` },
    { id: "description", label: "الوصف" },
  ] as const;

  type TabId = (typeof TABS)[number]["id"];
  // Handlers

  const handleAddToCart = async () => {
    const item = {
      productId: String(product.id),
      quantity: cartCount,
      title: product.title,
      unitPrice: product.price,
      imageUrl: (product.images?.[0]?.imageUrl ?? null) as string | null,
      storeId: (product.store?.id ?? null) as string | null,
    };

    try {
      await addItemToCart({
        item,
        isAuthenticated: isAuthenticated,
        dispatch,
        addToCartApi: isAuthenticated
          ? (it: { productId: string; quantity: number }) =>
              addItemApi(it).unwrap()
          : undefined,
        getState: () => store.getState(),
      });

      showNotification({
        variant: "success",
        message: `تمت إضافة ${cartCount} منتج للسلة!`,
      });
    } catch (err) {
      console.error(err);
      showNotification({
        variant: "error",
        message: "فشل إضافة المنتج للسلة",
      });
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    if (!isFavorite) {
      showNotification({
        variant: "success",
        message: "تم إضافة المنتج إلى المفضلة!",
      });
    } else {
      showNotification({
        variant: "error",
        message: "تم إزالة المنتج من المفضلة",
      });
    }
    console.log("handle Toggle Favorite");
  };

  const handleViewStore = (storeSubdomain?: string) => {
    console.log("handle View Store");
    if (storeSubdomain) navigate(`/@${storeSubdomain}`);
  };

  if (!id) {
    return (
      <section className="container mx-auto px-4 py-10" dir="rtl">
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-red-700">
          معرف المنتج غير صالح.
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-10" dir="rtl">
        <div className="rounded-lg border border-gray-100 bg-white p-6 text-center">
          جاري تحميل تفاصيل المنتج...
        </div>
      </section>
    );
  }

  if (isError || !data?.data) {
    return (
      <section className="container mx-auto px-4 py-10" dir="rtl">
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-red-700">
          تعذر تحميل تفاصيل المنتج.
        </div>
      </section>
    );
  }

  const product = data.data;

  const minCount = product.stockQuantity > 0 ? 1 : 0;
  const maxCount = product.stockQuantity ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link className="hover:text-blue-600" to="/">
            الرئيسية
          </Link>
          <span>/</span>
          <Link className="hover:text-blue-600" to="/products">
            المنتجات
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/** Product Image and Details */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={
                    product.images?.[0]?.imageUrl ||
                    "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
                  }
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Product Details */}
            <div>
              <div className="mb-4">
                <Link
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2"
                  to={`/@${product.store?.subdomain}`}
                >
                  <Store size={16} className="text-blue-600" />
                  {product.store?.name || "متجر دكان"}
                </Link>

                <h1 className="mb-2">{product.title}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Stars rating={4.5} size={20} />
                  </div>
                  <div className="text-sm text-gray-600">4.5 (82 تقييم)</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-3xl text-blue-600 mb-2">
                  {product.price?.toLocaleString()} ج.م
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600">
                    متوفر ( {product.stockQuantity} قطعة )
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                {product.description || "لا يوجد وصف لهذا المنتج حالياً."}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-lg border-gray-200">
                  <Button
                    onClick={() =>
                      cartCount > minCount && setCartCount(cartCount - 1)
                    }
                    className={`w-9! h-9! border-0! text-black ${cartCount <= minCount ? "cursor-not-allowed opacity-50" : ""}`}
                    variant="outline-accent"
                    icon={<Minus size={16} />}
                    disabled={cartCount <= minCount}
                  />
                  <span className="px-4 py-2 min-w-12 text-center">
                    {cartCount}
                  </span>
                  <Button
                    onClick={() =>
                      cartCount < maxCount && setCartCount(cartCount + 1)
                    }
                    className={`w-9! h-9! border-0! text-black ${cartCount >= maxCount ? "cursor-not-allowed opacity-50" : ""}`}
                    variant="outline-accent"
                    icon={<Plus size={16} />}
                    disabled={cartCount >= maxCount}
                  />
                </div>
                <Button
                  className="h-10! flex-1"
                  icon={<ShoppingCart size={20} />}
                  onClick={() => handleAddToCart()}
                  disabled={product.stockQuantity <= 0}
                >
                  {product.stockQuantity <= 0 ? "غير متوفر" : "أضف للسلة"}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleToggleFavorite()}
                  variant={isFavorite ? "primary" : "outline-accent"}
                  className={`h-10! flex-1 rounded-lg border! outline-none! text-sm! lg:text-base! ${
                    isFavorite ? "text-white!" : "text-black! hover:text-white!"
                  }`}
                >
                  <Heart
                    size={16}
                    className={`ml-2 ${isFavorite ? "fill-current" : ""}`}
                  />
                  {isFavorite ? "في المفضلة" : "المفضلة"}
                </Button>

                <Button
                  onClick={() => handleViewStore(product.store?.subdomain)}
                  variant="outline-accent"
                  className="h-10! flex-1 rounded-lg text-black! border! outline-none! text-sm! lg:text-base! hover:text-white!"
                >
                  <Store size={16} className="ml-2" />
                  عرض المتجر
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Interactive tabs: description / reviews / shipping */}
          <div
            dir="ltr"
            className="flex flex-col gap-2"
            onKeyDown={(e) => {
              // basic keyboard support: left/right arrows
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const order = ["shipping", "reviews", "description"] as const;
                const idx = order.indexOf(activeTab);
                const next =
                  e.key === "ArrowRight"
                    ? (idx + 1) % order.length
                    : (idx - 1 + order.length) % order.length;
                setActiveTab(order[next]);
              }
            }}
          >
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="bg-accent-light flex h-11 w-fit items-center justify-center rounded-2xl p-1 text-sm ml-auto"
            >
              {TABS.map(({ id, label }) => {
                const isActive = activeTab === id;
                return (
                  <Button
                    key={id}
                    variant={isActive ? "hero" : "outline-accent"}
                    type="button"
                    role="tab"
                    id={`tab-trigger-${id}`}
                    aria-selected={isActive}
                    onClick={() => setActiveTab(id as TabId)}
                    tabIndex={isActive ? 0 : -1}
                    className={[
                      "mx-1! px-4! h-full! text-black! border-none! focus:outline-none! focus:ring-0! focus-visible:outline-none! focus-visible:ring-0! transition-all duration-200",
                      isActive
                        ? "bg-white! outline! outline-primary! shadow-sm!"
                        : "border-none! outline-none! hover:bg-white/30! ",
                    ].join(" ")}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
            <div
              dir="rtl"
              role="tabpanel"
              aria-labelledby="tab-trigger-description"
              id="tab-content-description"
              hidden={activeTab !== "description"}
              className="flex-1 outline-none mt-6"
            >
              <h3 className="mb-4">تفاصيل المنتج</h3>
              <p className="text-gray-600">
                USB 3.0، نقل سريع، تصميم مدمج ومقاوم للصدمات.
              </p>
              <div className="mt-6 space-y-2">
                <p>
                  <span className="text-gray-600">التصنيف:</span> الإلكترونيات
                </p>
                <p>
                  <span className="text-gray-600">المخزون:</span> 47 قطعة
                </p>
                <p>
                  <span className="text-gray-600">رقم المنتج:</span> prod-e14
                </p>
              </div>
            </div>

            <div
              dir="rtl"
              role="tabpanel"
              aria-labelledby="tab-trigger-reviews"
              id="tab-content-reviews"
              hidden={activeTab !== "reviews"}
              className="flex-1 outline-none mt-6"
            >
              <h3 className="mb-6">تقييمات العملاء</h3>
              <div className="space-y-4">
                {mockReviewsData.length === 0 ? (
                  <p className="text-gray-600">لا توجد تقييمات حالياً.</p>
                ) : (
                  mockReviewsData.map((review) => (
                    <ReviewCard key={review.id} review={review} starSize={16} />
                  ))
                )}
              </div>
            </div>

            <div
              dir="rtl"
              role="tabpanel"
              aria-labelledby="tab-trigger-shipping"
              id="tab-content-shipping"
              hidden={activeTab !== "shipping"}
              className="flex-1 outline-none mt-6"
            >
              <h3 className="mb-4">معلومات الشحن</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  • الشحن العادي: {mockShippingInfo.standardShipping} أيام عمل
                </p>
                <p>
                  • الشحن السريع: {mockShippingInfo.expressShipping} أيام عمل
                </p>
                <p>
                  • شحن مجاني للطلبات فوق{" "}
                  {mockShippingInfo.freeShippingThreshold} ج.م
                </p>
                <p>
                  • سياسة إرجاع خلال {mockShippingInfo.returnPolicyDays} يوم
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections (e.g., Similar Products) */}
        <div>
          <h2 className="mb-6">منتجات ذات صلة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockRelatedProducts.map((item) => (
              <Card
                key={item.id}
                variant="default"
                className="border-none! shadow-md hover:shadow-lg"
              >
                <Link to={`/products/${item.id}`}>
                  <div className="bg-white rounded-lg transition-shadow overflow-hidden">
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="text-blue-600">
                        {item.price.toLocaleString()} ج.م
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

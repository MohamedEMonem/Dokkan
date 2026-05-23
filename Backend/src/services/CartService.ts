import prisma from "../config/db.js";
import redisClient from "../utils/redisClient.js";

const SHIPPING_ESTIMATE = 5.0;

const cartKey = (userId: string) => `cart:${userId}`;

const addToCart = async (userId: string, productId: string, quantity = 1) => {
  if (!userId || !productId) throw new Error("userId and productId are required");
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error("quantity must be a positive integer");

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, title: true, stockQuantity: true, deletedAt: true },
  });

  if (!product || product.deletedAt) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  if (product.stockQuantity < 1) {
    throw new Error("OUT_OF_STOCK");
  }

  const newQty = await redisClient.hIncrBy(cartKey(userId), productId, quantity);
  return newQty;
};

const removeFromCart = async (userId: string, productId: string) => {
  if (!userId || !productId) throw new Error("userId and productId are required");
  const deleted = await redisClient.hDel(cartKey(userId), productId);
  return deleted;
};

const updateCartItem = async (userId: string, productId: string, quantity: number) => {
  if (!userId || !productId) throw new Error("userId and productId are required");
  if (!Number.isInteger(quantity)) throw new Error("quantity must be an integer");

  if (quantity <= 0) {
    return removeFromCart(userId, productId);
  }

  await redisClient.hSet(cartKey(userId), productId, String(quantity));
  return quantity;
};

const getCart = async (userId: string) => {
  if (!userId) throw new Error("userId is required");

  const rawHash = await redisClient.hGetAll(cartKey(userId));

  if (!rawHash || Object.keys(rawHash).length === 0) {
    return {
      stores: [],
      itemsTotal: 0,
      shippingEstimate: 0,
      grandTotal: 0,
    };
  }

  const productIds = Object.keys(rawHash);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      price: true,
      stockQuantity: true,
      storeId: true,
      store: {
        select: { id: true, name: true },
      },
      images: {
        take: 1,
        select: { imageUrl: true },
      },
    },
  });

  const productMap = Object.fromEntries(
    products.map((p) => [p.id, p]),
  );

  // Build items and group by store
  type CartItem = {
    productId: string;
    title: string;
    imageUrl: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    inStock: boolean;
  };

  const storeGroups = new Map<
    string,
    { storeId: string; storeName: string; items: CartItem[]; storeTotal: number }
  >();

  let itemsTotal = 0;

  for (const [productId, qtyStr] of Object.entries(rawHash)) {
    const product = productMap[productId];
    if (!product) {
      await redisClient.hDel(cartKey(userId), productId);
      continue;
    }

    const quantity = parseInt(qtyStr, 10);
    const unitPrice = Number(product.price);
    const lineTotal = parseFloat((unitPrice * quantity).toFixed(2));

    const item: CartItem = {
      productId,
      title: product.title,
      imageUrl: product.images[0]?.imageUrl ?? null,
      unitPrice,
      quantity,
      lineTotal,
      inStock: product.stockQuantity > 0,
    };

    const sid = product.storeId;
    if (!storeGroups.has(sid)) {
      storeGroups.set(sid, {
        storeId: sid,
        storeName: product.store.name.trim(),
        items: [],
        storeTotal: 0,
      });
    }

    const group = storeGroups.get(sid)!;
    group.items.push(item);
    group.storeTotal = parseFloat((group.storeTotal + lineTotal).toFixed(2));

    itemsTotal += lineTotal;
  }

  itemsTotal = parseFloat(itemsTotal.toFixed(2));
  const stores = Array.from(storeGroups.values());
  const shippingEstimate = stores.length > 0 ? SHIPPING_ESTIMATE * stores.length : 0;
  const grandTotal = parseFloat((itemsTotal + shippingEstimate).toFixed(2));

  return { stores, itemsTotal, shippingEstimate, grandTotal };
};

const clearCart = async (userId: string) => {
  if (!userId) throw new Error("userId is required");
  await redisClient.del(cartKey(userId));
};

export { addToCart, clearCart, getCart, removeFromCart, updateCartItem };
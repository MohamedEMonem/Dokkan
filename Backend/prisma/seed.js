import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import prismaClientPkg from "@prisma/client";
import { randomUUID } from "crypto";
import { randomBytes, pbkdf2 as pbkdf2Callback } from "crypto";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { meilisearchService } from "../dist/services/meilisearchService.js";

const { PrismaClient } = prismaClientPkg;
const pbkdf2 = promisify(pbkdf2Callback);

const currentDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(currentDir, "../.env") });

// ─── Password helpers ───────────────────────────────────────────────────────
const PASSWORD_ALGORITHM  = "pbkdf2";
const PASSWORD_DIGEST     = "sha256";
const PASSWORD_ITERATIONS = 310000;
const PASSWORD_KEY_LENGTH = 32;
const PASSWORD_SALT_BYTES = 16;

function toBase64Url(value) {
  return value.toString("base64url");
}

async function hashPassword(password) {
  const salt       = randomBytes(PASSWORD_SALT_BYTES);
  const derivedKey = await pbkdf2(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST);
  return [PASSWORD_ALGORITHM, PASSWORD_DIGEST, String(PASSWORD_ITERATIONS), toBase64Url(salt), toBase64Url(derivedKey)].join("$");
}

// ─── Prisma client ───────────────────────────────────────────────────────────
const connectionString = process.env.DATABASE_URL;
const adapter  = new PrismaPg({ connectionString });
const prisma   = new PrismaClient({ adapter });

// ─── Utility helpers ─────────────────────────────────────────────────────────
const pick   = (arr) => arr[Math.floor(Math.random() * arr.length)];
const range  = (n)   => Array.from({ length: n }, (_, i) => i);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randDecimal = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ─── Static data pools ───────────────────────────────────────────────────────
const FIRST_NAMES = ["Alice","Bob","Carol","David","Eva","Frank","Grace","Hank","Iris","Jack","Karen","Leo","Mia","Noah","Olivia","Paul","Quinn","Rachel","Sam","Tina","Uma","Victor","Wendy","Xander","Yara","Zane"];
const LAST_NAMES  = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Martinez","Wilson","Anderson","Taylor","Thomas","Moore","Jackson","White","Harris","Martin","Thompson","Young"];

const STORE_ADJECTIVES = ["Bright","Urban","Fresh","Prime","Elite","Golden","Swift","Cozy","Bold","Pure"];
const STORE_NOUNS      = ["Mart","Hub","Shop","Depot","Corner","Place","Market","Store","Bazaar","Emporium"];

const PRODUCT_TEMPLATES = [
  { title: "Wireless Bluetooth Headphones",   category: "Electronics",   price: [29.99, 199.99] },
  { title: "Running Shoes",                   category: "Sports",        price: [49.99, 150.00] },
  { title: "Organic Face Cream",              category: "Beauty",        price: [12.99, 59.99]  },
  { title: "Stainless Steel Water Bottle",    category: "Home & Kitchen",price: [9.99,  39.99]  },
  { title: "Yoga Mat",                        category: "Sports",        price: [15.99, 69.99]  },
  { title: "Novel: The Silent Path",          category: "Books",         price: [8.99,  24.99]  },
  { title: "Men's Slim-Fit Jeans",            category: "Fashion",       price: [29.99, 89.99]  },
  { title: "Women's Summer Dress",            category: "Fashion",       price: [24.99, 79.99]  },
  { title: "Smart LED Desk Lamp",             category: "Electronics",   price: [19.99, 59.99]  },
  { title: "Protein Powder – Vanilla",        category: "Health",        price: [25.99, 69.99]  },
  { title: "Ceramic Coffee Mug Set",          category: "Home & Kitchen",price: [14.99, 45.99]  },
  { title: "Kids Backpack",                   category: "Kids",          price: [19.99, 55.99]  },
  { title: "Mechanical Keyboard",             category: "Electronics",   price: [49.99, 179.99] },
  { title: "Scented Soy Candle",             category: "Home & Kitchen",price: [8.99,  32.99]  },
  { title: "Vitamin C Supplement",            category: "Health",        price: [9.99,  29.99]  },
  { title: "Sunglasses – UV400",              category: "Fashion",       price: [14.99, 89.99]  },
  { title: "Portable Phone Charger 20000mAh", category: "Electronics",   price: [24.99, 59.99]  },
  { title: "Resistance Band Set",             category: "Sports",        price: [12.99, 39.99]  },
  { title: "Moisturising Shampoo",            category: "Beauty",        price: [6.99,  22.99]  },
  { title: "Wooden Chess Set",               category: "Kids",          price: [19.99, 79.99]  },
];

const REVIEW_TEXTS = [
  "Absolutely love this product! Exceeded my expectations.",
  "Great quality for the price. Would definitely buy again.",
  "Decent product, shipping was fast and packaging was secure.",
  "Not bad overall, but the colour was slightly different from the photos.",
  "Perfect gift idea. My friend loved it!",
  "Very durable and well-made. Highly recommend.",
  "Good value for money. Does exactly what it says.",
  "Arrived on time and in perfect condition.",
  "A bit smaller than expected but works great.",
  "Top quality! Will be ordering more soon.",
  "Average product. Nothing special but does the job.",
  "Excellent customer service along with a great product.",
];

const STORE_RESPONSES = [
  "Thank you so much for your kind review!",
  "We really appreciate your feedback and hope to serve you again.",
  "So glad you enjoyed your purchase! Come back soon.",
  null, null, null, // some orders don't get a response
];

const MESSAGE_CONTENTS = [
  "Hi, do you have this in a different colour?",
  "When will my order arrive?",
  "Can I get a bulk discount?",
  "Is this product still available?",
  "I'd like to return my recent order.",
  "Thank you for the quick delivery!",
  "Do you offer gift wrapping?",
  "My order was damaged on arrival. Can you help?",
  "Can you customise this product?",
  "What is your return policy?",
];

const NOTIFICATION_TYPES = ["order_placed","order_shipped","order_delivered","review_received","message_received","payment_success","payment_failed"];

const PLAN_DEFINITIONS = [
  { name: "Starter",      price: "9.99",  features: { products: 50,   storage: "1GB",  analytics: false, support: "email" } },
  { name: "Professional", price: "29.99", features: { products: 500,  storage: "10GB", analytics: true,  support: "priority" } },
  { name: "Enterprise",   price: "99.99", features: { products: -1,   storage: "100GB",analytics: true,  support: "dedicated" } },
];

const CATEGORY_TREE = [
  { name: "Electronics",    children: ["Mobile Phones","Laptops","Audio","Cameras"] },
  { name: "Fashion",        children: ["Men's Clothing","Women's Clothing","Shoes","Accessories"] },
  { name: "Home & Kitchen", children: ["Cookware","Furniture","Bedding","Decor"] },
  { name: "Sports",         children: ["Gym Equipment","Outdoor","Team Sports","Cycling"] },
  { name: "Beauty",         children: ["Skincare","Haircare","Makeup","Fragrances"] },
  { name: "Health",         children: ["Vitamins","Supplements","Medical Devices"] },
  { name: "Books",          children: ["Fiction","Non-Fiction","Children's Books","Textbooks"] },
  { name: "Kids",           children: ["Toys","Baby Gear","Educational"] },
];

// ─── Main seed ───────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱  Starting bulk seed...\n");

  const hashedPassword = await hashPassword("Pass1234!");

  // ── 1. Plans ────────────────────────────────────────────────────────────────
  console.log("Creating plans...");
  const plans = [];
  for (const def of PLAN_DEFINITIONS) {
    const plan = await prisma.plan.upsert({
      where:  { id: (await prisma.plan.findFirst({ where: { name: def.name } }))?.id ?? randomUUID() },
      update: {},
      create: { id: randomUUID(), name: def.name, price: def.price, features: def.features },
    });
    plans.push(plan);
  }
  // Simpler upsert: just try to find first, then create if missing
  const finalPlans = [];
  for (const def of PLAN_DEFINITIONS) {
    let plan = await prisma.plan.findFirst({ where: { name: def.name } });
    if (!plan) {
      plan = await prisma.plan.create({ data: { id: randomUUID(), name: def.name, price: def.price, features: def.features } });
    }
    finalPlans.push(plan);
  }

  // ── 3. Admin user ───────────────────────────────────────────────────────────
  console.log("Creating admin user...");
  let adminUser = await prisma.user.findUnique({ where: { email: "admin@test.com" } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: { id: randomUUID(), name: "Super Admin", email: "admin@test.com", password: hashedPassword, role: "Admin", isVerified: true },
    });
  }

  // ── 4. Store owners + stores ────────────────────────────────────────────────
  console.log("Creating store owners and stores...");
  const stores = [];
  const owners = [];

  for (let i = 0; i < 5; i++) {
    const email = `owner${i + 1}@test.com`;
    let owner = await prisma.user.findUnique({ where: { email } });
    if (!owner) {
      const fn = FIRST_NAMES[i % FIRST_NAMES.length];
      const ln = LAST_NAMES[i % LAST_NAMES.length];
      owner = await prisma.user.create({
        data: {
          id: randomUUID(), name: `${fn} ${ln}`.slice(0, 50), email,
          password: hashedPassword, role: "StoreOwner", isVerified: true,
          contactNumber: `+1${randInt(2000000000, 9999999999)}`,
        },
      });
    }
    owners.push(owner);

    const subdomain = `${STORE_ADJECTIVES[i].toLowerCase()}${STORE_NOUNS[i].toLowerCase()}`;
    let store = await prisma.store.findUnique({ where: { subdomain } });
    if (!store) {
      store = await prisma.store.create({
        data: {
          id: randomUUID(), ownerId: owner.id,
          name: `${STORE_ADJECTIVES[i]} ${STORE_NOUNS[i]}`.slice(0, 50),
          subdomain,
          status: pick(["Active","Active","Active","Pending","Suspended"]),
          description: `Welcome to ${STORE_ADJECTIVES[i]} ${STORE_NOUNS[i]}! We offer the best products at great prices.`,
          logoUrl: `https://picsum.photos/seed/${subdomain}logo/200/200`,
          coverBannerUrl: `https://picsum.photos/seed/${subdomain}banner/1200/400`,
          businessAddress: `${randInt(1,999)} Main Street, City, Country`,
          vatNumber: `VAT${randInt(100000000, 999999999)}`,
          themeSettings: { primaryColor: pick(["#6366f1","#0ea5e9","#10b981","#f59e0b","#ef4444"]), fontFamily: pick(["Inter","Roboto","Poppins"]) },
          createdAt: daysAgo(randInt(30, 365)),
        },
      });
    }
    stores.push(store);

    // Subscription for each active store
    const existingSub = await prisma.subscription.findFirst({ where: { storeId: store.id } });
    if (!existingSub) {
      const plan = pick(finalPlans);
      await prisma.subscription.create({
        data: {
          id: randomUUID(), storeId: store.id, planId: plan.id,
          status: pick(["active","active","trialing","past_due"]),
          nextBillingDate: daysAgo(-randInt(1, 30)),
        },
      });
    }
  }

  // ── 5. Categories (tree) ────────────────────────────────────────────────────
  console.log("Creating categories...");
  const categoryMap = new Map(); // storeId → (category name → category record)
  let categoryCount = 0;

  for (const store of stores) {
    const storeCategoryMap = new Map();

    for (const node of CATEGORY_TREE) {
      let parent = await prisma.category.findFirst({ where: { name: node.name, storeId: store.id } });
      if (!parent) {
        parent = await prisma.category.create({
          data: { id: randomUUID(), name: node.name, storeId: store.id },
        });
      }
      storeCategoryMap.set(node.name, parent);

      for (const childName of node.children) {
        let child = await prisma.category.findFirst({ where: { name: childName, storeId: store.id } });
        if (!child) {
          child = await prisma.category.create({
            data: { id: randomUUID(), name: childName, parentCategoryId: parent.id, storeId: store.id },
          });
        }
        storeCategoryMap.set(childName, child);
      }
    }

    categoryMap.set(store.id, storeCategoryMap);
    categoryCount += storeCategoryMap.size;
  }

  // ── 6. Customers ─────────────────────────────────────────────────────────────
  console.log("Creating customers...");
  const customers = [];

  for (let i = 0; i < 20; i++) {
    const email = `customer${i + 1}@test.com`;
    let customer = await prisma.user.findUnique({ where: { email } });
    if (!customer) {
      const fn = FIRST_NAMES[(i + 5) % FIRST_NAMES.length];
      const ln = LAST_NAMES[(i + 3) % LAST_NAMES.length];
      customer = await prisma.user.create({
        data: {
          id: randomUUID(), name: `${fn} ${ln}`.slice(0, 50), email,
          password: hashedPassword, role: "Customer",
          isVerified: Math.random() > 0.2,
          contactNumber: Math.random() > 0.3 ? `+1${randInt(2000000000, 9999999999)}` : null,
          createdAt: daysAgo(randInt(0, 180)),
        },
      });
    }
    customers.push(customer);
  }

  // ── 7. Store employees ───────────────────────────────────────────────────────
  console.log("Creating store employees...");
  for (const store of stores.slice(0, 3)) {
    for (const customer of customers.slice(0, 3)) {
      const existing = await prisma.storeEmployee.findUnique({
        where: { userId_storeId: { userId: customer.id, storeId: store.id } },
      });
      if (!existing) {
        await prisma.storeEmployee.create({
          data: {
            userId: customer.id, storeId: store.id,
            permissions: { canEditProducts: true, canViewOrders: true, canManageInventory: Math.random() > 0.5 },
          },
        });
      }
    }
  }

  // ── 8. Products ──────────────────────────────────────────────────────────────
  console.log("Creating products...");
  const products = [];

  for (const store of stores) {
    const storeCategories = categoryMap.get(store.id);
    const allCategoryNames = [...storeCategories.keys()];
    const productCount = randInt(12, 20);
    for (let i = 0; i < productCount; i++) {
      const template   = PRODUCT_TEMPLATES[i % PRODUCT_TEMPLATES.length];
      const catName    = template.category;
      const category   = storeCategories.get(catName) ?? storeCategories.get(pick(allCategoryNames));
      const titleSuffix = i >= PRODUCT_TEMPLATES.length ? ` v${Math.ceil(i / PRODUCT_TEMPLATES.length)}` : "";

      // Avoid duplicate title+store combos
      const existing = await prisma.product.findFirst({ where: { storeId: store.id, title: template.title + titleSuffix } });
      if (existing) { products.push(existing); continue; }

      const product = await prisma.product.create({
        data: {
          id: randomUUID(), storeId: store.id, categoryId: category.id,
          title: (template.title + titleSuffix).slice(0, 150),
          description: `High-quality ${template.title}. Perfect for everyday use. Available in multiple variants.`,
          price: randDecimal(...template.price),
          stockQuantity: pick([0, randInt(1, 10), randInt(10, 50), randInt(50, 200)]),
          status: Math.random() > 0.15 ? "Active" : "Inactive",
          createdAt: daysAgo(randInt(0, 180)),
        },
      });
      products.push(product);

      // 1–4 images per product
      const imageCount = randInt(1, 4);
      for (let img = 0; img < imageCount; img++) {
        await prisma.productImage.create({
          data: {
            id: randomUUID(), productId: product.id,
            imageUrl: `https://picsum.photos/seed/${product.id}img${img}/600/600`,
            sortOrder: img,
          },
        });
      }
    }
  }

  // ── 9. Orders + order items + payment transactions ───────────────────────────
  console.log("Creating orders...");
  const orders = [];

  for (const customer of customers) {
    const orderCount = randInt(2, 6);
    for (let o = 0; o < orderCount; o++) {
      const store          = pick(stores);
      const storeProducts  = products.filter(p => p.storeId === store.id && p.status === "Active");
      if (storeProducts.length === 0) continue;

      const itemCount   = randInt(1, 4);
      const pickedItems = range(itemCount).map(() => pick(storeProducts));
      const orderStatus = pick(["Pending","Pending","Shipped","Delivered","Delivered","Delivered","Cancelled"]);
      const payStatus   = orderStatus === "Cancelled" ? pick(["Failed","Pending"]) : pick(["Success","Success","Pending"]);

      let subtotal = 0;
      const itemsData = pickedItems.map(p => {
        const qty   = randInt(1, 3);
        const price = parseFloat(p.price);
        subtotal   += price * qty;
        return { productId: p.id, quantity: qty, priceAtPurchase: price.toFixed(2) };
      });

      const shippingCost = parseFloat(randDecimal(0, 15));
      const taxAmount    = parseFloat((subtotal * 0.08).toFixed(2));
      const totalAmount  = (subtotal + shippingCost + taxAmount).toFixed(2);

      const order = await prisma.order.create({
        data: {
          id: randomUUID(), customerId: customer.id, storeId: store.id,
          status: orderStatus, paymentStatus: payStatus,
          shippingAddress: {
            line1: `${randInt(1, 999)} Elm Street`, city: pick(["Cairo","Alex","Giza","Mansoura","Tanta"]),
            country: "EG", postalCode: String(randInt(10000, 99999)),
          },
          totalAmount, shippingCost: shippingCost.toFixed(2), taxAmount,
          createdAt: daysAgo(randInt(0, 120)),
          orderItems: { create: itemsData.map(d => ({ id: randomUUID(), ...d })) },
        },
      });
      orders.push(order);

      // Payment transaction for paid orders
      if (payStatus === "Success") {
        await prisma.paymentTransaction.create({
          data: {
            id: randomUUID(), payableId: order.id, payableType: "Order",
            gatewayName: pick(["stripe","paymob","paypal"]),
            gatewayTransactionId: `txn_${randomUUID().replace(/-/g, "").slice(0, 20)}`,
            amount: totalAmount,
            status: "Success",
            createdAt: daysAgo(randInt(0, 120)),
          },
        });
      }
    }
  }

  // ── 10. Reviews ──────────────────────────────────────────────────────────────
  console.log("Creating reviews...");
  const reviewedCombos = new Set(); // prevent duplicate (product, customer, order)

  const deliveredOrders = orders.filter(o => o.status === "Delivered");
  for (const order of deliveredOrders) {
    if (Math.random() > 0.65) continue; // ~35% of delivered orders get a review
    const orderItems = await prisma.orderItem.findMany({ where: { orderId: order.id } });
    for (const item of orderItems) {
      const key = `${item.productId}::${order.customerId}::${order.id}`;
      if (reviewedCombos.has(key)) continue;
      reviewedCombos.add(key);
      await prisma.review.create({
        data: {
          id: randomUUID(), productId: item.productId,
          customerId: order.customerId, orderId: order.id,
          rating: pick([3, 4, 4, 5, 5, 5]),
          reviewText: pick(REVIEW_TEXTS),
          storeResponse: pick(STORE_RESPONSES),
          createdAt: daysAgo(randInt(0, 60)),
        },
      });
    }
  }

  // ── 11. Carts ────────────────────────────────────────────────────────────────
  console.log("Creating carts...");
  for (const customer of customers.slice(0, 12)) {
    const existing = await prisma.cart.findUnique({ where: { customerId: customer.id } });
    if (existing) continue;

    const store        = pick(stores);
    const storeProds   = products.filter(p => p.storeId === store.id && p.status === "Active");
    if (storeProds.length === 0) continue;

    const cart = await prisma.cart.create({
      data: {
        id: randomUUID(), customerId: customer.id,
        expiresAt: daysAgo(-randInt(1, 7)),
      },
    });

    const cartItemCount = randInt(1, 4);
    const usedProds = new Set();
    for (let i = 0; i < cartItemCount; i++) {
      const prod = pick(storeProds);
      if (usedProds.has(prod.id)) continue;
      usedProds.add(prod.id);
      await prisma.cartItem.create({
        data: { id: randomUUID(), cartId: cart.id, productId: prod.id, quantity: randInt(1, 3) },
      });
    }
  }

  // ── 10.5. Seed Meilisearch for Products ──────────────────────────────────────
  console.log("Seeding Meilisearch for products...");
  try {
    const meiliprod = await prisma.product.findMany({
      include: { category: true, store: true },
    });
    const productDocs = meiliprod.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: Number(product.price),
      categoryName: product.category.name,
      storeName: product.store.name,
    }));
    await meilisearchService.seedMeilisearch("products", productDocs);
    console.log("✅ Products seeded to Meilisearch");
  } catch (err) {
    console.error("⚠️  Failed to seed products to Meilisearch:", err.message);
  }

  // ── 10.6. Seed Meilisearch for Stores ────────────────────────────────────────
  console.log("Seeding Meilisearch for stores...");
  try {
    const storeDocs = stores.map(store => ({
      id: store.id,
      name: store.name,
      description: store.description,
      subdomain: store.subdomain,
      status: store.status,
      ownerId: store.ownerId,
      logoUrl: store.logoUrl,
      coverBannerUrl: store.coverBannerUrl,
    }));
    await meilisearchService.seedMeilisearch("stores", storeDocs);
    console.log("✅ Stores seeded to Meilisearch");
  } catch (err) {
    console.error("⚠️  Failed to seed stores to Meilisearch:", err.message);
  }

  // ── 11. Messages ─────────────────────────────────────────────────────────────
  console.log("Creating messages...");
  for (let m = 0; m < 40; m++) {
    const customer = pick(customers);
    const owner    = pick(owners);
    const store    = stores.find(s => s.ownerId === owner.id) ?? pick(stores);
    const fromCustomer = Math.random() > 0.4;
    await prisma.message.create({
      data: {
        id: randomUUID(),
        senderId:   fromCustomer ? customer.id : owner.id,
        receiverId: fromCustomer ? owner.id    : customer.id,
        storeId:    store.id,
        content:    pick(MESSAGE_CONTENTS),
        readStatus: Math.random() > 0.4,
        createdAt:  daysAgo(randInt(0, 60)),
      },
    });
  }

  // ── 13. Notifications ───────────────────────────────────────────────────────
  console.log("Creating notifications...");
  const allUsers = [...customers, ...owners, adminUser];
  for (let n = 0; n < 80; n++) {
    const user = pick(allUsers);
    const type = pick(NOTIFICATION_TYPES);
    await prisma.notification.create({
      data: {
        id: randomUUID(), userId: user.id,
        type,
        content: type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()).slice(0, 50),
        readStatus: Math.random() > 0.5,
        createdAt: daysAgo(randInt(0, 30)),
      },
    });
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log("\n✅  Bulk seed complete!\n");
  console.log("  Plans       :", finalPlans.length);
  console.log("  Categories  :", categoryCount);
  console.log("  Users       :", 1 + owners.length + customers.length, "(1 admin + owners + customers)");
  console.log("  Stores      :", stores.length);
  console.log("  Products    :", products.length, "(with images)");
  console.log("  Orders      :", orders.length);
  console.log("  Reviews     :", reviewedCombos.size);
  console.log("  Messages    : 40");
  console.log("  Notifications: 80");
  console.log("\n  Default password for ALL accounts: Pass1234!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

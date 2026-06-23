import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import prismaClientPkg from "@prisma/client";
import { randomUUID } from "crypto";
import { randomBytes, pbkdf2 as pbkdf2Callback } from "crypto";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const { PrismaClient } = prismaClientPkg;
const pbkdf2 = promisify(pbkdf2Callback);

const currentDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(currentDir, "../.env") });

const hasMeilisearchConfig = Boolean(
  process.env.MEILISEARCH_URL || (process.env.MEILI_HOST && process.env.MEILI_PORT),
);

const meilisearchService = hasMeilisearchConfig
  ? (await import("../src/services/meilisearchService.js")).meilisearchService
  : {
      seedMeilisearch: async () => undefined,
    };

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
  // Electronics
  {
    title: "آيفون 15 برو ماكس 256 جيجابايت تيتانيوم",
    category: "Electronics",
    subCategory: "Mobile Phones",
    price: [55000.00, 75000.00],
    description: "هاتف آبل الرائد بتصميم من التيتانيوم القوي وخفيف الوزن، مع كاميرا رئيسية بدقة 48 ميجابكسل وتقريب بصري مذهل، ومزود بمعالج A17 Pro للألعاب والأداء الفائق.",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1695048132958-393ff8bb68b3?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "سامسونج جالاكسي إس 24 ألترا 512 جيجابايت",
    category: "Electronics",
    subCategory: "Mobile Phones",
    price: [50000.00, 70000.00],
    description: "هاتف سامسونج العملاق مع قلم S Pen المدمج، وشاشة أموليد مسطحة فائقة السطوع، وكاميرا بدقة 200 ميجابكسل مدعومة بتقنيات الذكاء الاصطناعي Galaxy AI.",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "ماك بوك برو 14 بوصة معالج M3 رامات 16 جيجابايت",
    category: "Electronics",
    subCategory: "Laptops",
    price: [70000.00, 95000.00],
    description: "جهاز ماك بوك برو المحمول بشريحة M3 المبتكرة، يوفر سرعة مذهلة وعمر بطارية يدوم طوال اليوم، مع شاشة ليكويد ريتنا XDR فائقة النقاء للمحترفين.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "كمبيوتر محمول للألعاب أسوس روج زيفيروس G14",
    category: "Electronics",
    subCategory: "Laptops",
    price: [55000.00, 80000.00],
    description: "كمبيوتر محمول خارق مخصص للألعاب بشاشة ذات معدل تحديث مرتفع، كارت شاشة Nvidia RTX متطور ونظام تبريد ذكي لأقوى جلسات اللعب.",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "سماعات سوني WH-1000XM5 لاسلكية مانعة للضوضاء",
    category: "Electronics",
    subCategory: "Audio",
    price: [15000.00, 22000.00],
    description: "سماعات رأس لاسلكية تقدم أفضل تجربة إلغاء ضوضاء في العالم، وصوت عالي الدقة مع ميزة التحدث المباشر والتحكم الذكي باللمس.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "سماعات أبل إيربودز برو الجيل الثاني",
    category: "Electronics",
    subCategory: "Audio",
    price: [9000.00, 12000.00],
    description: "سماعات أذن لاسلكية مع ميزة إلغاء الضوضاء النشط المتطور، ووضع شفافية الصوت، وتصميم مريح ومقاوم للعرق والماء مع علبة شحن MagSafe.",
    images: [
      "https://images.unsplash.com/photo-1588449668365-d15e397f6787?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "كاميرا سوني ألفا 7 الجيل الرابع بدون مرآة",
    category: "Electronics",
    subCategory: "Cameras",
    price: [90000.00, 120000.00],
    description: "كاميرا هجينة متطورة للمحترفين بدقة 33 ميجابكسل، تدعم تصوير الفيديو بدقة 4K وميزة التركيز التلقائي الذكي على العين والوجه.",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
    ]
  },
  
  // Fashion
  {
    title: "تي شيرت بوما رجالي كاجوال بشعار الماركة",
    category: "Fashion",
    subCategory: "Men's T-Shirts",
    price: [800.00, 1500.00],
    description: "تي شيرت كاجوال مريح مصنوع من قطن ناعم عالي الجودة ومناسب للاستخدام اليومي بتصميم عصري وبسيط.",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "تي شيرت نايكي دراي فيت الرياضي للرجال",
    category: "Fashion",
    subCategory: "Men's T-Shirts",
    price: [1000.00, 2000.00],
    description: "تي شيرت رياضي بتقنية Dri-FIT الطاردة للعرق للحفاظ على جفافك وانتعاشك أثناء التمارين الرياضية الصعبة.",
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "فستان زارا صيفي متوسط الطول بنقشة زهور",
    category: "Fashion",
    subCategory: "Women's Dresses",
    price: [2000.00, 4000.00],
    description: "فستان صيفي متوسط الطول مصنوع من قماش خفيف ومريح بنقشة زهور أنيقة مناسب للإطلالات الصباحية والنزهات.",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "حذاء جري أديداس ألترابوست خفيف الوزن مريح",
    category: "Fashion",
    subCategory: "Shoes",
    price: [6000.00, 9000.00],
    description: "حذاء جري أسطوري مزود بتقنية Boost في النعل الأوسط لتوفر لك طاقة وراحة لا مثيل لهما مع كل خطوة جري.",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "حذاء رياضي كلاسيكي نايكي إير فورس 1",
    category: "Fashion",
    subCategory: "Shoes",
    price: [5000.00, 8000.00],
    description: "الحذاء الرياضي الكلاسيكي الأكثر شهرة بتصميم جلدي متين ونعل مبطن بتقنية Air لراحة وأناقة تدوم طويلاً.",
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "نظارات شمسية ريبان كلاسيكية وايفارير عصرية",
    category: "Fashion",
    subCategory: "Accessories",
    price: [4000.00, 7000.00],
    description: "نظارات شمسية أصلية بإطار متين وعدسات مستقطبة تحمي العين تماماً من الأشعة فوق البنفسجية وتمنحك مظهراً جذاباً.",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"
    ]
  },
  
  // Home & Kitchen
  {
    title: "ثلاجة سامسونج ذكية باب فرنسي 29 قدم",
    category: "Home & Kitchen",
    subCategory: "Fridges & Kitchen Appliances",
    price: [45000.00, 65000.00],
    description: "ثلاجة ذكية سعة كبيرة بتصميم باب فرنسي أنيق، مع تقنية التبريد الثنائي للحفاظ على الطعام طازجاً لفترة أطول ونظام موفر للطاقة.",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "حلة ضغط كهربائية إنستانت بوت ذكية 9 في 1",
    category: "Home & Kitchen",
    subCategory: "Fridges & Kitchen Appliances",
    price: [5000.00, 9000.00],
    description: "جهاز ططهي متعدد الوظائف يجمع بين طنجرة الضغط، والطهي البطيء، وتحضير الأرز، والزبادي، والتحمير في جهاز ذكي واحد لتوفير الوقت.",
    images: [
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "وحدة أرفف إيكيا كالاكس باللون الأبيض",
    category: "Home & Kitchen",
    subCategory: "Furniture",
    price: [3000.00, 6000.00],
    description: "خززانة أرفف عملية وبتصميم بسيط وعصري يمكن استخدامها عمودياً أو أفقياً لتنظيم الكتب والديكورات في المنزل.",
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80"
    ]
  },
  
  // Beauty & Cosmetics
  {
    title: "منظف مرطب للوجه سيرافي لطيف 473 مل",
    category: "Beauty & Cosmetics",
    subCategory: "Skincare",
    price: [500.00, 900.00],
    description: "منظف لطيف للبشرة العادية إلى الجافة يحتوي على السيراميد الأساسي وحمض الهيالورونيك لتنظيف وترطيب حاجز البشرة الطبيعي.",
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "شامبو أولابليكس رقم 4 لإصلاح وتقوية الشعر والتالف",
    category: "Beauty & Cosmetics",
    subCategory: "Haircare",
    price: [1200.00, 1800.00],
    description: "شامبو علاجي احترافي ينظف الشعر بلطف ويعمل على إعادة بناء الروابط التالفة وترطيب الشعر وتقويته من الجذور.",
    images: [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "عطر ديور سوفاج تواليت رجالي فخم 100 مل",
    category: "Beauty & Cosmetics",
    subCategory: "Fragrances",
    price: [5000.00, 8000.00],
    description: "عطر رجالي أيقوني يمزج بين روائح الحمضيات المنعشة والأخشاب الدافئة ليعطي رائحة غامضة وفواحة تدوم طويلاً وتجذب الانتباه.",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80"
    ]
  },
  
  // Sports
  {
    title: "تي شيرت أندر آرمور رياضي خفيف ومريح للتمارين",
    category: "Sports",
    subCategory: "Activewear",
    price: [1200.00, 2500.00],
    description: "تي شيرت رياضي خفيف ومطاطي مصنوع من ألياف سريعة الجفاف ومضادة للروائح لتوفير أقصى درجات الراحة أثناء الجري والتمارين.",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "دمبل بوفليكس ذكي قابل للتعديل للأوزان 552",
    category: "Sports",
    subCategory: "Gym Equipment",
    price: [15000.00, 25000.00],
    description: "دمبل ذكي يوفر لك مساحة كبيرة حيث يمكن تعديل الوزن بسهولة من 2 إلى 24 كجم ليغني عن 15 زوجاً من الدنابل التقليدية.",
    images: [
      "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=600&q=80"
    ]
  },
  
  // Books
  {
    title: "كتاب العادات الذرية للكاتب جيمس كلير مترجم",
    category: "Books",
    subCategory: "Fiction & Novels",
    price: [250.00, 500.00],
    description: "الكتاب الأكثر مبيعاً عالمياً والذي يقدم دليلاً عملياً لتغيير عاداتك السيئة وبناء عادات إيجابية جديدة بالاعتماد على خطوات علمية بسيطة.",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "كتاب اجتياز مقابلة البرمجة والترميز النسخة السادسة",
    category: "Books",
    subCategory: "Educational Textbooks",
    price: [800.00, 1500.00],
    description: "الدليل الشامل والمرجع الأهم للمبرمجين لاجتياز المقابلات الفنية في كبرى شركات التكنولوجيا العالمية مع 189 سؤالاً وحلاً فنيًا.",
    images: [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80"
    ]
  }
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
  {
    slug: "basic",
    name: "الباقة الأساسية",
    price: "999.00",
    features: {
      unlimitedProducts: true,
      fullControlPanel: true,
      basicTechnicalSupport: true,
      electronicPayment: false,
    },
  },
  {
    slug: "plus",
    name: "باقة بلس",
    price: "1999.00",
    features: {
      unlimitedProducts: true,
      fullControlPanel: true,
      basicTechnicalSupport: true,
      electronicPayment: true,
      employees: 2,
      advancedAnalytics: true,
      priorityTechnicalSupport: true,
      mostPopular: true,
    },
  },
  {
    slug: "pro",
    name: "باقة برو",
    price: "2999.00",
    features: {
      unlimitedProducts: true,
      fullControlPanel: true,
      basicTechnicalSupport: true,
      electronicPayment: true,
      employees: 5,
      advancedAnalytics: true,
      priorityTechnicalSupport: true,
      customDomain: true,
      advancedMarketingTools: true,
      comprehensiveReports: true,
      dedicatedSupport24_7: true,
    },
  },
];

const CATEGORY_TREE = [
  {
    name: "Electronics",
    children: [
      { name: "Mobile Phones" },
      { name: "Laptops" },
      { name: "Audio" },
      { name: "Cameras" }
    ]
  },
  {
    name: "Fashion",
    children: [
      { name: "Men's T-Shirts" },
      { name: "Women's Dresses" },
      { name: "Shoes" },
      { name: "Accessories" }
    ]
  },
  {
    name: "Home & Kitchen",
    children: [
      { name: "Fridges & Kitchen Appliances" },
      { name: "Furniture" },
      { name: "Bedding" },
      { name: "Decor" }
    ]
  },
  {
    name: "Beauty & Cosmetics",
    children: [
      { name: "Skincare" },
      { name: "Haircare" },
      { name: "Makeup" },
      { name: "Fragrances" }
    ]
  },
  {
    name: "Sports",
    children: [
      { name: "Activewear" },
      { name: "Gym Equipment" }
    ]
  },
  {
    name: "Books",
    children: [
      { name: "Fiction & Novels" },
      { name: "Educational Textbooks" }
    ]
  }
];

async function seedCategoryBranch(storeId, node, categoryMap) {
  const existingCategory = await prisma.category.findFirst({
    where: { name: node.name, storeId },
  });

  const category = existingCategory ?? await prisma.category.create({
    data: {
      id: randomUUID(),
      name: node.name,
      storeId,
    },
  });

  categoryMap.set(node.name, category);

  for (const child of node.children ?? []) {
    const existingSubCategory = await prisma.subCategory.findFirst({
      where: {
        name: child.name,
        categoryId: category.id,
      },
    });

    const subCategory = existingSubCategory ?? await prisma.subCategory.create({
      data: {
        id: randomUUID(),
        name: child.name,
        categoryId: category.id,
      },
    });

    categoryMap.set(child.name, subCategory);
  }

  return category;
}

// ─── Main seed ───────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱  Starting bulk seed...\n");

  const hashedPassword = await hashPassword("Pass1234!");

  console.log("Clearing database...");
  await prisma.message.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.productReview.deleteMany({});
  await prisma.storeReview.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.subCategory.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.storeEmployee.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.user.deleteMany({});

  // ── 1. Plans ────────────────────────────────────────────────────────────────
  console.log("Creating plans...");
  const finalPlans = [];

  for (const def of PLAN_DEFINITIONS) {
    const plan = await prisma.plan.create({
      data: {
        id: randomUUID(),
        slug: def.slug,
        name: def.name,
        price: def.price,
        features: def.features,
      },
    });
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
      await seedCategoryBranch(store.id, node, storeCategoryMap);
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
      const subCatName = template.subCategory;
      // Ensure we pick a leaf SubCategory for the product
      let category = storeCategories.get(subCatName) ?? storeCategories.get(pick(allCategoryNames));
      if (category) {
        // If this is a top-level Category (it won't have `categoryId`), find or create a SubCategory
        if (!category.categoryId) {
          const subs = await prisma.subCategory.findMany({ where: { categoryId: category.id } });
          if (subs.length > 0) {
            category = pick(subs);
          } else {
            const newSub = await prisma.subCategory.create({ data: { id: randomUUID(), name: `${category.name} - General`, categoryId: category.id } });
            category = newSub;
          }
        }
      }
      const titleSuffix = i >= PRODUCT_TEMPLATES.length ? ` v${Math.ceil(i / PRODUCT_TEMPLATES.length)}` : "";

      // Avoid duplicate title+store combos
      const existing = await prisma.product.findFirst({ where: { storeId: store.id, title: template.title + titleSuffix } });
      if (existing) { products.push(existing); continue; }

      const product = await prisma.product.create({
        data: {
          id: randomUUID(), storeId: store.id,
          subCategoryId: category.id,
          categoryId: category.categoryId,
          title: (template.title + titleSuffix).slice(0, 150),
          description: template.description || `High-quality ${template.title}.`,
          price: randDecimal(...template.price),
          stockQuantity: pick([0, randInt(1, 10), randInt(10, 50), randInt(50, 200)]),
          status: Math.random() > 0.15 ? "Active" : "Inactive",
          createdAt: daysAgo(randInt(0, 180)),
        },
      });
      products.push(product);

      // Seed realistic template images
      const templateImages = template.images || [`https://picsum.photos/seed/${product.id}img0/600/600`];
      for (let img = 0; img < templateImages.length; img++) {
        await prisma.productImage.create({
          data: {
            id: randomUUID(), productId: product.id,
            imageUrl: templateImages[img],
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
      await prisma.productReview.create({
        data: {
          id: randomUUID(), productId: item.productId,
          customerId: order.customerId, orderId: order.id,
          rating: pick([3, 4, 4, 5, 5, 5]),
          reviewText: pick(REVIEW_TEXTS),
          storeReply: pick(STORE_RESPONSES),
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
      include: { subCategory: true, store: true },
    });
    const productDocs = meiliprod.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: Number(product.price),
      categoryName: product.subCategory?.name ?? null,
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

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

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ─── Static data pools ───────────────────────────────────────────────────────
const FIRST_NAMES = ["Alice","Bob","Carol","David","Eva","Frank","Grace","Hank","Iris","Jack","Karen","Leo","Mia","Noah","Olivia","Paul","Quinn","Rachel","Sam","Tina","Uma","Victor","Wendy","Xander","Yara","Zane"];
const LAST_NAMES  = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Martinez","Wilson","Anderson","Taylor","Thomas","Moore","Jackson","White","Harris","Martin","Thompson","Young"];

// Custom metadata for 6 stores mapping exactly to 6 categories
const STORES_METADATA = [
  {
    name: "تكنو زون / TechnoZone",
    subdomain: "technozone",
    category: "Electronics",
    description: "متجرك الأول لأحدث الهواتف الذكية، أجهزة الكمبيوتر المحمول، ومستلزمات التقنية بأسعار منافسة.",
    logoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&h=200&q=80",
    coverBannerUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1200&h=400&q=80",
    themeColor: "#6366f1"
  },
  {
    name: "تريند فاشن / TrendFashion",
    subdomain: "trendfashion",
    category: "Fashion",
    description: "اكتشف أحدث صيحات الموضة والملابس والأحذية الرجالية والنسائية بتصاميم عصرية تناسب كل الأذواق.",
    logoUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=200&h=200&q=80",
    coverBannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&h=400&q=80",
    themeColor: "#ef4444"
  },
  {
    name: "بيت العائلة / FamilyHome",
    subdomain: "familyhome",
    category: "Home & Kitchen",
    description: "كل ما تحتاجه لتأثيث وتزيين منزلك ومطبخك من أثاث وديكورات وأجهزة مطبخ بأعلى جودة.",
    logoUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=200&h=200&q=80",
    coverBannerUrl: "https://images.unsplash.com/photo-1556911220-115f7448dbf3?auto=format&fit=crop&w=1200&h=400&q=80",
    themeColor: "#10b981"
  },
  {
    name: "جلو بيوتي / GlowBeauty",
    subdomain: "glowbeauty",
    category: "Beauty & Cosmetics",
    description: "منتجات العناية بالبشرة والشعر، المكياج، وأرقى العطور العالمية لتبرز جمالك الطبيعي.",
    logoUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&h=200&q=80",
    coverBannerUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&h=400&q=80",
    themeColor: "#f59e0b"
  },
  {
    name: "باور فيت / PowerFit",
    subdomain: "powerfit",
    category: "Sports",
    description: "تجهيزات رياضية كاملة، ملابس رياضية مريحة، وأحدث معدات الجيم المنزلية للياقة بدنية أفضل.",
    logoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&h=200&q=80",
    coverBannerUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&h=400&q=80",
    themeColor: "#0ea5e9"
  },
  {
    name: "مكتبة القراء / ReadersBookstore",
    subdomain: "readersbookstore",
    category: "Books",
    description: "وابل من المعرفة والكتب التعليمية، الأدبية، والروايات الأكثر مبيعاً لتغذية عقلك وفكرك.",
    logoUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&h=200&q=80",
    coverBannerUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&h=400&q=80",
    themeColor: "#6b7280"
  }
];

const PRODUCT_TEMPLATES = [
  // === Electronics ===
  // 1. الهواتف المحمولة
  {
    title: "آيفون 15 برو ماكس 256 جيجابايت تيتانيوم",
    category: "Electronics",
    subCategory: "الهواتف المحمولة",
    price: [55000, 75000],
    description: "هاتف آبل الرائد بتصميم من التيتانيوم القوي وخفيف الوزن، مع كاميرا رئيسية بدقة 48 ميجابكسل وتقريب بصري مذهل، ومزود بمعالج A17 Pro للألعاب والأداء الفائق.",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1695048132958-393ff8bb68b3?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "سامسونج جالاكسي إس 24 ألترا 512 جيجابايت",
    category: "Electronics",
    subCategory: "الهواتف المحمولة",
    price: [50000, 70000],
    description: "هاتف سامسونج العملاق مع قلم S Pen المدمج، وشاشة أموليد مسطحة فائقة السطوع، وكاميرا بدقة 200 ميجابكسل مدعومة بتقنيات الذكاء الاصطناعي Galaxy AI.",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "هاتف شاومي 14 الترا الذكي 5G",
    category: "Electronics",
    subCategory: "الهواتف المحمولة",
    price: [40000, 52000],
    description: "هاتف رائد بكاميرا لايكا الاحترافية رباعية العدسات، مستشعر بمقاس 1 بوصة، شاشة AMOLED مذهلة ومعالج سناب دراجون الجيل الثالث.",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "جوجل بكسل 8 برو 256 جيجابايت سعة",
    category: "Electronics",
    subCategory: "الهواتف المحمولة",
    price: [35000, 48000],
    description: "الهاتف الذكي الأكثر ذكاءً من جوجل مع معالج Tensor G3، وكاميرا مذهلة تلتقط أدق التفاصيل مع ميزات التعديل السحرية للصور بالذكاء الاصطناعي.",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 2. أجهزة الكمبيوتر المحمول
  {
    title: "ماك بوك برو 14 بوصة معالج M3 رامات 16 جيجابايت",
    category: "Electronics",
    subCategory: "أجهزة الكمبيوتر المحمول",
    price: [70000, 95000],
    description: "جهاز ماك بوك برو المحمول بشريحة M3 المبتكرة، يوفر سرعة مذهلة وعمر بطارية يدوم طوال اليوم، مع شاشة ليكويد ريتنا XDR فائقة النقاء للمحترفين.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "كمبيوتر محمول للألعاب أسوس روج زيفيروس G14",
    category: "Electronics",
    subCategory: "أجهزة الكمبيوتر المحمول",
    price: [55000, 80000],
    description: "كمبيوتر محمول خارق مخصص للألعاب بشاشة ذات معدل تحديث مرتفع، كارت شاشة Nvidia RTX متطور ونظام تبريد ذكي لأقوى جلسات اللعب.",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "لابتوب ديل إكس بي إس 13 باللمس موديل 9315",
    category: "Electronics",
    subCategory: "أجهزة الكمبيوتر المحمول",
    price: [45000, 62000],
    description: "جهاز رفيع وخفيف الوزن بتصميم مذهل من الألمونيوم، شاشة إنفينيتي إيدج فائقة الدقة باللمس، وأداء سريع يناسب رجال الأعمال والطلاب.",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "لابتوب لينوفو ثينك باد X1 كاربون الجيل 11",
    category: "Electronics",
    subCategory: "أجهزة الكمبيوتر المحمول",
    price: [65000, 88000],
    description: "اللابتوب الأقوى للأعمال الشاقة بهيكل من ألياف الكربون المتين، لوحة مفاتيح أسطورية مريحة، وميزات أمان متقدمة لحماية بياناتك.",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 3. أجهزة الصوت
  {
    title: "سماعات سوني WH-1000XM5 لاسلكية مانعة للضوضاء",
    category: "Electronics",
    subCategory: "أجهزة الصوت",
    price: [15000, 22000],
    description: "سماعات رأس لاسلكية تقدم أفضل تجربة إلغاء ضوضاء في العالم، وصوت عالي الدقة مع ميزة التحدث المباشر والتحكم الذكي باللمس.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "سماعات أبل إيربودز برو الجيل الثاني",
    category: "Electronics",
    subCategory: "أجهزة الصوت",
    price: [9000, 12000],
    description: "سماعات أذن لاسلكية مع ميزة إلغاء الضوضاء النشط المتطور، ووضع شفافية الصوت، وتصميم مريح ومقاوم للعرق والماء مع علبة شحن MagSafe.",
    images: [
      "https://images.unsplash.com/photo-1588449668365-d15e397f6787?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "مكبر صوت بلوتوث لاسلكي محمولة من جي بي إل فليب 6",
    category: "Electronics",
    subCategory: "أجهزة الصوت",
    price: [4500, 6500],
    description: "مكبر صوت محمول قوي مقاوم للماء والغبار بمعيار IP67، يوفر صوتاً نقياً وباس عميق مع بطارية تدوم حتى 12 ساعة من التشغيل المتواصل.",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "مكبر صوت ذكي من سونوس إيرا 100 لاسلكي",
    category: "Electronics",
    subCategory: "أجهزة الصوت",
    price: [11000, 16000],
    description: "مكبر صوت ذكي منزلي بصوت نقي يملأ الغرفة، يدعم التحكم الصوتي والاتصال اللاسلكي عبر الواي فاي والبلوتوث لتجربة استماع غامرة.",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 4. الكاميرات
  {
    title: "كاميرا سوني ألفا 7 الجيل الرابع بدون مرآة",
    category: "Electronics",
    subCategory: "الكاميرات",
    price: [90000, 120000],
    description: "كاميرا هجينة متطورة للمحترفين بدقة 33 ميجابكسل، تدعم تصوير الفيديو بدقة 4K وميزة التركيز التلقائي الذكي على العين والوجه.",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "كاميرا كانون EOS R6 Mark II الاحترافية",
    category: "Electronics",
    subCategory: "الكاميرات",
    price: [95000, 130000],
    description: "كاميرا إطار كامل بدون مرآة تقدم سرعة التقاط فائقة وأداء تصوير منخفض الإضاءة مذهل، ومثالية لتصوير الفعاليات والرياضة والفيديو الاحترافي.",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "كاميرا فورية فوجي فيلم إنستاكس ميني 12 للصور الفورية",
    category: "Electronics",
    subCategory: "الكاميرات",
    price: [3500, 5000],
    description: "كاميرا فورية ممتعة وسهلة الاستخدام بضغطة زر واحدة لتسجيل الذكريات وطباعتها فوراً بألوان زاهية وتصميم أنيق وجذاب.",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // === Fashion ===
  // 1. تي شيرتات رجالي
  {
    title: "تي شيرت بوما رجالي كاجوال بشعار الماركة",
    category: "Fashion",
    subCategory: "تي شيرتات رجالي",
    price: [800, 1500],
    description: "تي شيرت كاجوال مريح مصنوع من قطن ناعم عالي الجودة ومناسب للاستخدام اليومي بتصميم عصري وبسيط.",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "تي شيرت نايكي دراي فيت الرياضي للرجال",
    category: "Fashion",
    subCategory: "تي شيرتات رجالي",
    price: [1000, 2000],
    description: "تي شيرت رياضي بتقنية Dri-FIT الطاردة للعرق للحفاظ على جفافك وانتعاشك أثناء التمارين الرياضية الصعبة.",
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "قميص كلاسيكي قطن 100% من تومي هيلفيغر",
    category: "Fashion",
    subCategory: "تي شيرتات رجالي",
    price: [2500, 4000],
    description: "قميص كلاسيكي فاخر بأكمام طويلة مصنوع من القطن الصافي 100%، خياطة متقنة ومظهر أنيق مناسب للمناسبات الرسمية والعمل.",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "بولو شيرت كاجوال من لاكوست للرجال بألوان متعددة",
    category: "Fashion",
    subCategory: "تي شيرتات رجالي",
    price: [2800, 4500],
    description: "قميص بولو كلاسيكي بشعار التمساح الشهير مصنوع من قطن البيكيه المريح، متوفر بألوان جذابة وقصة كلاسيكية ممتازة.",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 2. فساتين نسائي
  {
    title: "فستان زارا صيفي متوسط الطول بنقشة زهور",
    category: "Fashion",
    subCategory: "فساتين نسائي",
    price: [2000, 4000],
    description: "فستان صيفي متوسط الطول مصنوع من قماش خفيف ومريح بنقشة زهور أنيقة مناسب للإطلالات الصباحية والنزهات.",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "فستان سهرة شيفون طويل بأكمام طويلة وتطريز ناعم",
    category: "Fashion",
    subCategory: "فساتين نسائي",
    price: [4500, 8000],
    description: "فستان سهرة راقي مصنوع من الشيفون الانسيابي الناعم مع تطريز يدوي دقيق على الصدر والأكمام ليمنحك إطلالة ملكية في الحفلات.",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "فستان كاجوال قصير قطن ناعم مريح يومي",
    category: "Fashion",
    subCategory: "فساتين نسائي",
    price: [1500, 2800],
    description: "فستان يومي مريح ومرن بأكمام قصيرة، مصنوع من القطن والياف الليكرا، رائع للمشاوير السريعة والمنزل.",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 3. أحذية
  {
    title: "حذاء جري أديداس ألترابوست خفيف الوزن مريح",
    category: "Fashion",
    subCategory: "أحذية",
    price: [6000, 9000],
    description: "حذاء جري أسطوري مزود بتقنية Boost في النعل الأوسط لتوفر لك طاقة وراحة لا ميل لهما مع كل خطوة جري.",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "حذاء رياضي كلاسيكي نايكي إير فورس 1",
    category: "Fashion",
    subCategory: "أحذية",
    price: [5000, 8000],
    description: "الحذاء الرياضي الكلاسيكي الأكثر شهرة بتصميم جلدي متين ونعل مبطن بتقنية Air لراحة وأناقة تدوم طويلاً.",
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "حذاء جلد كلاسيكي رسمي رجالي إيطالي فخم",
    category: "Fashion",
    subCategory: "أحذية",
    price: [3500, 5500],
    description: "حذاء رسمي كلاسيكي مصنوع يدوياً من الجلد الإيطالي الطبيعي 100% بنعل مريح وتصميم أنيق يكمل بدلتك الرسمية.",
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "حذاء مشي مريح سكيتشرز جو ووك 6 مبطن وسهل الارتداء",
    category: "Fashion",
    subCategory: "أحذية",
    price: [2800, 4200],
    description: "حذاء مشي بدون أربطة خفيف الوزن للغاية، نعل مرن بنقاط توازن تدعم باطن القدم لراحة تامة أثناء الوقوف الطويل والمشي.",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 4. إكسسوارات
  {
    title: "نظارات شمسية ريبان كلاسيكية وايفارير عصرية",
    category: "Fashion",
    subCategory: "إكسسوارات",
    price: [4000, 7000],
    description: "نظارات شمسية أصلية بإطار متين وعدسات مستقطبة تحمي العين تماماً من الأشعة فوق البنفسجية وتمنحك مظهراً جذاباً.",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "ساعة يد جلد كلاسيكية كاسيو للرجال مقاومة للماء",
    category: "Fashion",
    subCategory: "إكسسوارات",
    price: [1800, 3000],
    description: "ساعة كاسيو اليابانية الأصلية بهيكل فضي وحزام جلدي طبيعي بني مقاومة للمياه، تصميم كلاسيكي جذاب ومناسب للعمل واليوميات.",
    images: [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "حقيبة يد جلدية نسائية من مايكل كورس عصرية",
    category: "Fashion",
    subCategory: "إكسسوارات",
    price: [8000, 13000],
    description: "حقيبة كتف نسائية راقية بتصميم واسع وجلد فاخر محفور عليه شعار الماركة مع تفاصيل معدنية ذهبية تزيدها جمالاً وأناقة.",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // === Home & Kitchen ===
  // 1. ثلاجات وأجهزة المطبخ
  {
    title: "ثلاجة سامسونج ذكية باب فرنسي 29 قدم",
    category: "Home & Kitchen",
    subCategory: "ثلاجات وأجهزة المطبخ",
    price: [45000, 65000],
    description: "ثلاجة ذكية سعة كبيرة بتصميم باب فرنسي أنيق، مع تقنية التبريد الثنائي للحفاظ على الطعام طازجاً لفترة أطول ونظام موفر للطاقة.",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "حلة ضغط كهربائية إنستانت بوت ذكية 9 في 1",
    category: "Home & Kitchen",
    subCategory: "ثلاجات وأجهزة المطبخ",
    price: [5000, 9000],
    description: "جهاز طهي متعدد الوظائف يجمع بين طنجرة الضغط، والطهي البطيء، وتحضير الأرز، والزبادي، والتحمير في جهاز ذكي واحد لتوفير الوقت.",
    images: [
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "قلاية هوائية فيليبس حجم كبير جداً XXL ديجيتال",
    category: "Home & Kitchen",
    subCategory: "ثلاجات وأجهزة المطبخ",
    price: [6500, 9500],
    description: "قلاية بدون زيت صحية وسريعة، تكفي لتحضير وجبات عائلية كاملة، مزودة بتقنية إزالة الدهون الزائدة بنسبة تصل إلى 90%.",
    images: [
      "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "خلاط نينجا الاحترافي لتحضير العصائر والسموذي بقوة 1000 واط",
    category: "Home & Kitchen",
    subCategory: "ثلاجات وأجهزة المطبخ",
    price: [3800, 5800],
    description: "خلاط قوي وفعال مع شفرات حادة تسحق الثلج والفواكه الصلبة في ثوانٍ لتحضير أشهى المشروبات الصحية والصلصات المنزلية.",
    images: [
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 2. أثاث
  {
    title: "وحدة أرفف إيكيا كالاكس باللون الأبيض",
    category: "Home & Kitchen",
    subCategory: "أثاث",
    price: [3000, 6000],
    description: "خزانة أرفف عملية وبتصميم بسيط وعصري يمكن استخدامها عمودياً أو أفقياً لتنظيم الكتب والديكورات في المنزل.",
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "أريكة معيشة مريحة 3 مقاعد بتصميم عصري ووسائد ناعمة",
    category: "Home & Kitchen",
    subCategory: "أثاث",
    price: [12000, 18000],
    description: "كنبة ثلاثية فخمة ومبطنة بقماش الكتان المعالج المقاوم للبقع، أرجل خشبية صلبة وتصميم حديث يضفي جمالاً على غرفة المعيشة.",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "طاولة قهوة خشبية مودرن مع وحدات تخزين مفتوحة",
    category: "Home & Kitchen",
    subCategory: "أثاث",
    price: [2500, 4500],
    description: "طاولة وسط لغرفة المعيشة مصنوعة من خشب البلوط المعالج بتصميم عملي ومساحة تخزين سفلية للمجلات وأجهزة التحكم.",
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "مكتب دراسة وعمل خشبي مع أدراج جانبية وقاعدة معدنية",
    category: "Home & Kitchen",
    subCategory: "أثاث",
    price: [4000, 7000],
    description: "مكتب عمل أنيق للدراسة أو العمل المنزلي بمساحة كافية للابتوب والشاشة، مزود بأدراج انسيابية لتنظيم الأوراق والأدوات المكتبية.",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 3. مستلزمات السرير
  {
    title: "طقم لحاف سرير مزدوج مايكروفايبر ناعم 4 قطع",
    category: "Home & Kitchen",
    subCategory: "مستلزمات السرير",
    price: [1200, 2200],
    description: "طقم سرير فاخر وناعم يتضمن لحاف دافئ، ملاءة مطاطية واثنين من أغطية الوسائد بتصميم متين وألوان مهدئة للأعصاب.",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "وسادة طبية ميموري فوم لدعم الرقبة والعمود الفقري",
    category: "Home & Kitchen",
    subCategory: "مستلزمات السرير",
    price: [600, 1200],
    description: "مخده طبية مريحة تحافظ على وضعية النوم المثالية وتقلل من آلام الرقبة بفضل تقنية رغوة الذاكرة المرنة وغطاء قابل للغسيل.",
    images: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 4. ديكور
  {
    title: "مصباح طاولة ذكي إل إي دي متعدد الألوان ومتوافق مع المساعد الذكي",
    category: "Home & Kitchen",
    subCategory: "ديكور",
    price: [1100, 2000],
    description: "أباجورة طاولة ذكية ومضيئة بألوان دافئة وباردة متعددة، تحكم لاسلكي بالهاتف لتغيير الإضاءة بما يناسب مزاجك وغرفتك.",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "طقم إطارات صور خشبية معلقة للحائط مكون من 5 قطع مختلفة الأحجام",
    category: "Home & Kitchen",
    subCategory: "ديكور",
    price: [800, 1500],
    description: "براويز خشبية أنيقة لترتيب وعرض صور عائلتك المفضلة أو اللوحات الفنية على الحائط بطريقة عصرية وجميلة.",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // === Beauty & Cosmetics ===
  // 1. العناية بالبشرة
  {
    title: "منظف مرطب للوجه سيرافي لطيف 473 مل",
    category: "Beauty & Cosmetics",
    subCategory: "العناية بالبشرة",
    price: [500, 900],
    description: "منظف لطيف للبشرة العادية إلى الجافة يحتوي على السيراميد الأساسي وحمض الهيالورونيك لتنظيف وترطيب حاجز البشرة الطبيعي.",
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "سيروم الهيالورونيك أسيد من ذا أوردينري لترطيب البشرة 30 مل",
    category: "Beauty & Cosmetics",
    subCategory: "العناية بالبشرة",
    price: [600, 1100],
    description: "سيروم ترطيب عميق للبشرة مدعم بفيتامين B5 لمكافحة الجفاف والخطوط الرفيعة وإعطاء البشرة نضارة ومرونة فورية.",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "واقي شمس لاروش بوزيه بعامل حماية 50+ سائل خفيف للبشرة المختلطة",
    category: "Beauty & Cosmetics",
    subCategory: "العناية بالبشرة",
    price: [850, 1400],
    description: "صن بلوك فائق الحماية يوفر وقاية عالية جداً من الأشعة فوق البنفسجية UVA/UVB، خفيف ولا يترك أي علامات بيضاء على البشرة.",
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "كريم ترطيب مغذي للبشرة الجافة والحساسة من كيلز 125 مل",
    category: "Beauty & Cosmetics",
    subCategory: "العناية بالبشرة",
    price: [1800, 2800],
    description: "كريم الترطيب الشهير الترا فيشال الذي يمنح البشرة ترطيباً يدوم 24 ساعة بمكونات طبيعية كالسqualane للحصول على نعومة فائقة.",
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 2. العناية بالشعر
  {
    title: "شامبو أولابليكس رقم 4 لإصلاح وتقوية الشعر والتالف",
    category: "Beauty & Cosmetics",
    subCategory: "العناية بالشعر",
    price: [1200, 1800],
    description: "شامبو علاجي احترافي ينظف الشعر بلطف ويعمل على إعادة بناء الروابط التالفة وترطيب الشعر وتقويته من الجذور.",
    images: [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "زيت الشعر المغذي والمقوي من ميلي بالروزماري والنعناع 60 مل",
    category: "Beauty & Cosmetics",
    subCategory: "العناية بالشعر",
    price: [550, 950],
    description: "زيت علاجي مكثف غني بالبيوتين والزيوت الأساسية لتغذية بصيلات الشعر، تقوية الأطراف، وتحفيز نمو الشعر وملء الفراغات.",
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "قناع مغذي للشعر بزبدة الشيا وزيت الخروع من شيا مويستشر",
    category: "Beauty & Cosmetics",
    subCategory: "العناية بالشعر",
    price: [900, 1500],
    description: "ماسك ترطيب عميق ومكثف للشعر الكيرلي والتالف، يمنح خصلات الشعر حيوية ولمعان ويسهل تسريح وفك تشابك الشعر.",
    images: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 3. المكياج
  {
    title: "أحمر شفاه كريمي مطفأ اللمعة من ماك بلون أحمر جذاب",
    category: "Beauty & Cosmetics",
    subCategory: "المكياج",
    price: [800, 1300],
    description: "أحمر شفاه كلاسيكي عالي الثبات ذو لون غني وجذاب بلمسة نهائية مطفية ناعمة لا تسبب جفاف الشفاه.",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "ماسكارا لتكثيف وتطويل الرموش للاش ديسكفري من ميبلين مقاومة للماء",
    category: "Beauty & Cosmetics",
    subCategory: "المكياج",
    price: [450, 750],
    description: "ماسكارا بفرشاة دقيقة ومميزة تغطي أصغر الرموش لتمنحك طولاً وتكثيفاً رائعاً بدون أي تكتل يدوم طوال اليوم.",
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "كريم أساس سائل بتغطية كاملة من هدى بيوتي فاو فلتر درجة تناسب الجميع",
    category: "Beauty & Cosmetics",
    subCategory: "المكياج",
    price: [1800, 2600],
    description: "فاونديشن سائل عالي الجودة وثبات فائق، يخفي عيوب البشرة تماماً ويوحد لونها بلمسة نهائية ناعمة كالفلتر تدوم 24 ساعة.",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 4. العطور
  {
    title: "عطر ديور سوفاج تواليت رجالي فخم 100 مل",
    category: "Beauty & Cosmetics",
    subCategory: "العطور",
    price: [5000, 8000],
    description: "عطر رجالي أيقوني يمزج بين روائح الحمضيات المنعشة والأخشاب الدافئة ليعطي رائحة غامضة وفواحة تدوم طويلاً وتجذب الانتباه.",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "عطر شانيل كوكو مادمويل نسائي أنيق 100 مل",
    category: "Beauty & Cosmetics",
    subCategory: "العطور",
    price: [5500, 8500],
    description: "عطر نسائي شرقي وجذاب يجمع بين نفحات الياسمين والورد والباتشولي ليعبر عن الأنوثة الطاغية والجاذبية الكلاسيكية.",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "عطر إيف سان لوران ليبر النسائي الراقي بتركيز أو دو برفيوم 90 مل",
    category: "Beauty & Cosmetics",
    subCategory: "العطور",
    price: [4800, 7500],
    description: "عطر نسائي أنيق يمثل روح الحرية بتركيبته المذهلة التي تدمج زهر البرتقال المغربي وحيوية الخزامى الفرنسي.",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // === Sports ===
  // 1. الملابس الرياضية
  {
    title: "تي شيرت أندر آرمور رياضي خفيف ومريح للتمارين",
    category: "Sports",
    subCategory: "الملابس الرياضية",
    price: [1200, 2500],
    description: "تي شيرت رياضي خفيف ومطاطي مصنوع من ألياف سريعة الجفاف ومضادة للروائح لتوفير أقصى درجات الراحة أثناء الجري والتمارين.",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "بنطال ضيق رياضي نايكي للنساء للتمارين واليوغا أسود اللون",
    category: "Sports",
    subCategory: "الملابس الرياضية",
    price: [1500, 2800],
    description: "ليقنز رياضي ضيق وعالي الخصر بتصميم مرن يتبع حركة الجسم بتقنية طاردة للرطوبة ليحافظ على راحتك أثناء اليوجا أو الجيم.",
    images: [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "هودي رياضي دافئ وسريع الجفاف للتمارين الخارجية من أديداس",
    category: "Sports",
    subCategory: "الملابس الرياضية",
    price: [2200, 3800],
    description: "هودي سويت شيرت دافئ مبطن بالملابس الرياضية الناعمة، مع غطاء للرأس وجيوب أمامية واسعة للوقاية من البرد أثناء التمارين الخارجية.",
    images: [
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 2. معدات الجيم
  {
    title: "دمبل بوفليكس ذكي قابل للتعديل للأوزان 552",
    category: "Sports",
    subCategory: "معدات الجيم",
    price: [15000, 25000],
    description: "دمبل ذكي يوفر لك مساحة كبيرة حيث يمكن تعديل الوزن بسهولة من 2 إلى 24 كجم ليغني عن 15 زوجاً من الدنابل التقليدية.",
    images: [
      "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "سجادة يوغا رياضية سميكة مانعة للانزلاق مع حزام حمل مريح",
    category: "Sports",
    subCategory: "معدات الجيم",
    price: [600, 1100],
    description: "سجادة تمارين رياضية فائقة النعومة والسمك لحماية المفاصل أثناء ممارسة اليوغا والبلاتس والتمدد، سهلة التنظيف بالماء والصابون.",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "حبل قفز ذكي مع شاشة عداد رقمية لحرق الدهون والتمارين السويدية",
    category: "Sports",
    subCategory: "معدات الجيم",
    price: [450, 800],
    description: "حبل نط ذكي مزود بمستشعرات لحساب عدد القفزات وحساب السعرات الحرارية المحروقة بدقة وعرضها على شاشة LED صغيرة مدمجة.",
    images: [
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "مجموعة أحزمة المقاومة المطاطية للتمارين المنزلية 5 قطع بأوزان مختلفة",
    category: "Sports",
    subCategory: "معدات الجيم",
    price: [350, 700],
    description: "حبال مقاومة مطاطية متينة لتمارين تمدد وتقوية كامل عضلات الجسم في المنزل، تأتي مع مقابض مريحة وحقيبة تخزين خفيفة.",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // === Books ===
  // 1. روايات وقصص
  {
    title: "كتاب العادات الذرية للكاتب جيمس كلير مترجم للعربية",
    category: "Books",
    subCategory: "روايات وقصص",
    price: [250, 500],
    description: "الكتاب الأكثر مبيعاً عالمياً والذي يقدم دليلاً عملياً لتغيير عاداتك السيئة وبناء عادات إيجابية جديدة بالاعتماد على خطوات علمية بسيطة.",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "رواية الخيميائي للكاتب العالمي باولو كويلو مترجمة للعربية",
    category: "Books",
    subCategory: "روايات وقصص",
    price: [200, 380],
    description: "رواية رمزية ساحرة عن راعي أندلسي شاب يقرر السفر عبر الصحراء بحثاً عن كنز مدفون بالقرب من الأهرامات وتكشف له رحلته عن ذاته وأحلامه.",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "رواية 1984 للكاتب جورج أورويل الشهيرة باللغة العربية",
    category: "Books",
    subCategory: "روايات وقصص",
    price: [220, 400],
    description: "الرواية الكلاسيكية الشهيرة والديستوبيا التي تقدم تحليلاً عميقاً للأنظمة الديكتاتورية والرقابة الشاملة ومصادرة حرية الرأي والتفكير.",
    images: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80"
    ]
  },

  // 2. كتب تعليمية
  {
    title: "كتاب اجتياز مقابلة البرمجة والترميز النسخة السادسة المعتمدة",
    category: "Books",
    subCategory: "كتب تعليمية",
    price: [800, 1500],
    description: "الدليل الشامل والمرجع الأهم للمبرمجين لاجتياز المقابلات الفنية في كبرى شركات التكنولوجيا العالمية مع 189 سؤالاً وحلاً فنيًا.",
    images: [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "كتاب التفكير السريع والبطيء الحائز على جائزة نوبل لدانيال كانمان",
    category: "Books",
    subCategory: "كتب تعليمية",
    price: [450, 750],
    description: "كتاب رائع يشرح كيفية عمل عقل الإنسان وينقسم التفكير فيه إلى نظامين: السريع والانفعالي، والبطيء والتحليلي وكيفية اتخاذ القرارات.",
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    title: "كتاب مقدمة في علم الخوارزميات وهياكل البيانات وبناء البرمجيات",
    category: "Books",
    subCategory: "كتب تعليمية",
    price: [650, 1100],
    description: "كتاب أكاديمي وعملي قيم يشرح أساسيات التفكير الخوارزمي وهياكل البيانات الرئيسية بلغة مبسطة وأمثلة برمجية واضحة للمطورين.",
    images: [
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80"
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
      { name: "الهواتف المحمولة" },
      { name: "أجهزة الكمبيوتر المحمول" },
      { name: "أجهزة الصوت" },
      { name: "الكاميرات" }
    ]
  },
  {
    name: "Fashion",
    children: [
      { name: "تي شيرتات رجالي" },
      { name: "فساتين نسائي" },
      { name: "أحذية" },
      { name: "إكسسوارات" }
    ]
  },
  {
    name: "Home & Kitchen",
    children: [
      { name: "ثلاجات وأجهزة المطبخ" },
      { name: "أثاث" },
      { name: "مستلزمات السرير" },
      { name: "ديكور" }
    ]
  },
  {
    name: "Beauty & Cosmetics",
    children: [
      { name: "العناية بالبشرة" },
      { name: "العناية بالشعر" },
      { name: "المكياج" },
      { name: "العطور" }
    ]
  },
  {
    name: "Sports",
    children: [
      { name: "الملابس الرياضية" },
      { name: "معدات الجيم" }
    ]
  },
  {
    name: "Books",
    children: [
      { name: "روايات وقصص" },
      { name: "كتب تعليمية" }
    ]
  }
];

async function seedCategoryBranch(node, categoryMap) {
  const existingCategory = await prisma.category.findUnique({
    where: { name: node.name },
  });

  const category = existingCategory ?? await prisma.category.create({
    data: {
      id: randomUUID(),
      name: node.name,
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

  for (let i = 0; i < STORES_METADATA.length; i++) {
    const meta = STORES_METADATA[i];
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

    const subdomain = meta.subdomain;
    let store = await prisma.store.findUnique({ where: { subdomain } });
    if (!store) {
      store = await prisma.store.create({
        data: {
          id: randomUUID(), ownerId: owner.id,
          name: meta.name.slice(0, 50),
          subdomain,
          status: pick(["Active","Active","Active","Pending","Suspended"]),
          description: meta.description,
          logoUrl: meta.logoUrl,
          coverBannerUrl: meta.coverBannerUrl,
          businessAddress: `${randInt(1,999)} Main Street, City, Country`,
          vatNumber: `VAT${randInt(100000000, 999999999)}`,
          themeSettings: { primaryColor: meta.themeColor, fontFamily: pick(["Inter","Roboto","Poppins"]) },
          createdAt: daysAgo(randInt(30, 365)),
        },
      });
    }
    // Attach assigned category to the store object in memory for product seeding
    store.assignedCategory = meta.category;
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
  const globalCategoryMap = new Map(); // category name → category record

  for (const node of CATEGORY_TREE) {
    await seedCategoryBranch(node, globalCategoryMap);
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
  const allCategoryNames = [...globalCategoryMap.keys()];

  // Pricing uniqueness tracking
  const usedPrices = new Set();
  function getUniquePrice(min, max) {
    const cleanMin = Math.ceil(min / 10) * 10;
    const cleanMax = Math.floor(max / 10) * 10;
    
    let attempts = 0;
    while (attempts < 1000) {
      const steps = Math.floor((cleanMax - cleanMin) / 10);
      if (steps <= 0) {
        const val = cleanMin;
        if (!usedPrices.has(val)) {
          usedPrices.add(val);
          return val;
        }
      } else {
        const val = cleanMin + randInt(0, steps) * 10;
        if (!usedPrices.has(val)) {
          usedPrices.add(val);
          return val;
        }
      }
      attempts++;
    }
    
    // Fallback if unique not found
    return cleanMin + randInt(0, Math.max(1, Math.floor((cleanMax - cleanMin) / 10))) * 10;
  }

  for (const store of stores) {
    const storeCategory = store.assignedCategory;
    const storeTemplates = PRODUCT_TEMPLATES.filter(p => p.category === storeCategory);
    const templatesToUse = storeTemplates.length > 0 ? storeTemplates : PRODUCT_TEMPLATES;
    
    const productCount = randInt(12, 20);
    for (let i = 0; i < productCount; i++) {
      const template = templatesToUse[i % templatesToUse.length];
      const subCatName = template.subCategory;
      // Ensure we pick a leaf SubCategory for the product
      let category = globalCategoryMap.get(subCatName) ?? globalCategoryMap.get(pick(allCategoryNames));
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
      
      const titleSuffix = i >= templatesToUse.length ? ` v${Math.ceil(i / templatesToUse.length)}` : "";

      // Avoid duplicate title+store combos
      const title = (template.title + titleSuffix).slice(0, 150);
      const existing = await prisma.product.findFirst({ where: { storeId: store.id, title } });
      if (existing) { products.push(existing); continue; }

      const finalPrice = getUniquePrice(...template.price);

      const product = await prisma.product.create({
        data: {
          id: randomUUID(), storeId: store.id,
          subCategoryId: category.id,
          categoryId: category.categoryId,
          title,
          description: template.description || `High-quality ${template.title}.`,
          price: finalPrice,
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

      const shippingCost = randInt(0, 15);
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
  console.log("  Categories  :", globalCategoryMap.size);
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

import { IStore, EStoreStatus } from "@/types/entities/store.types";

export const mockStoresData: IStore[] = [
  {
    id: "store-001",
    ownerId: "user-001",
    name: "راحة المنزل",
    subdomain: "rahat-almanzel",
    status: EStoreStatus.Active,
    description: "متجر متخصص في الأدوات المنزلية والإلكترونيات العملية.",
    businessAddress: "القاهرة",
    logoUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-002",
    ownerId: "user-002",
    name: "تقنية العصر",
    subdomain: "tech-era",
    status: EStoreStatus.Active,
    description: "أحدث الإكسسوارات والأجهزة الذكية بأسعار تنافسية.",
    businessAddress: "الجيزة",
    logoUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-003",
    ownerId: "user-003",
    name: "بيت الأناقة",
    subdomain: "home-elegance",
    status: EStoreStatus.Active,
    description: "مجموعة مختارة من الديكور المنزلي والمنتجات العصرية.",
    businessAddress: "الإسكندرية",
    logoUrl:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-004",
    ownerId: "user-004",
    name: "مركز الألعاب",
    subdomain: "gaming-hub",
    status: EStoreStatus.Active,
    description: "إكسسوارات وأجهزة مخصصة لعشاق الألعاب والـ setup العصري.",
    businessAddress: "المنصورة",
    logoUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-005",
    ownerId: "user-005",
    name: "مطبخ البيت",
    subdomain: "bayt-kitchen",
    status: EStoreStatus.Active,
    description: "أدوات مطبخ عملية ومنتجات يومية للمنزل العصري.",
    businessAddress: "طنطا",
    logoUrl:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-006",
    ownerId: "user-006",
    name: "الذوق الرفيع",
    subdomain: "al-thawq-alrfei",
    status: EStoreStatus.Active,
    description: "ديكور وأكسسوارات منزلية بتفاصيل أنيقة ومميزة.",
    businessAddress: "أسيوط",
    logoUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-007",
    ownerId: "user-007",
    name: "المدينة الذكية",
    subdomain: "smart-city",
    status: EStoreStatus.Active,
    description: "تقنيات وأجهزة ذكية للبيت والمكتب بأسعار منافسة.",
    businessAddress: "الزقازيق",
    logoUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-008",
    ownerId: "user-008",
    name: "ركن الأطفال",
    subdomain: "kids-corner",
    status: EStoreStatus.Active,
    description: "منتجات آمنة وممتعة للأطفال والهدايا العائلية.",
    businessAddress: "السويس",
    logoUrl:
      "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-009",
    ownerId: "user-009",
    name: "العالم الرياضي",
    subdomain: "sports-world",
    status: EStoreStatus.Active,
    description: "معدات رياضية واكسسوارات للتمارين المنزلية والنوادي.",
    businessAddress: "بورسعيد",
    logoUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-010",
    ownerId: "user-010",
    name: "أزياء اليوم",
    subdomain: "fashion-today",
    status: EStoreStatus.Active,
    description: "ملابس وإكسسوارات عصرية تناسب كل الأذواق.",
    businessAddress: "المنيا",
    logoUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-011",
    ownerId: "user-011",
    name: "مكتبة المعرفة",
    subdomain: "knowledge-library",
    status: EStoreStatus.Active,
    description: "كتب وأدوات مكتبية ومنتجات تعليمية متنوعة.",
    businessAddress: "بني سويف",
    logoUrl:
      "https://images.unsplash.com/photo-1526243741027-444d633d7365?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-012",
    ownerId: "user-012",
    name: "عطور الشرق",
    subdomain: "perfumes-east",
    status: EStoreStatus.Active,
    description: "مجموعة عطور وهدايا فاخرة بروائح مميزة.",
    businessAddress: "دمياط",
    logoUrl:
      "https://images.unsplash.com/photo-1519822474010-04f27a57b4c6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-013",
    ownerId: "user-013",
    name: "ركن الجمال",
    subdomain: "beauty-corner",
    status: EStoreStatus.Active,
    description: "منتجات عناية شخصية ومستحضرات تجميل مختارة.",
    businessAddress: "الغردقة",
    logoUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1522338055737-c3f0c6a9e4b5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-014",
    ownerId: "user-014",
    name: "تقنيات المكتب",
    subdomain: "office-tech",
    status: EStoreStatus.Active,
    description: "حلول تقنية وإكسسوارات للمكاتب والعمل عن بعد.",
    businessAddress: "الفيوم",
    logoUrl:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-015",
    ownerId: "user-015",
    name: "بيت الراحة",
    subdomain: "home-comfort",
    status: EStoreStatus.Active,
    description: "مفروشات وملحقات تمنح المنزل لمسة مريحة ودافئة.",
    businessAddress: "قنا",
    logoUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-016",
    ownerId: "user-016",
    name: "مذاق المدينة",
    subdomain: "city-taste",
    status: EStoreStatus.Active,
    description: "منتجات غذائية مختارة ومستلزمات مطبخ يومية.",
    businessAddress: "القصير",
    logoUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-017",
    ownerId: "user-017",
    name: "حديقة المنزل",
    subdomain: "home-garden",
    status: EStoreStatus.Active,
    description: "نباتات وأدوات تنسيق حدائق ومساحات خارجية.",
    businessAddress: "العريش",
    logoUrl:
      "https://images.unsplash.com/photo-1512428813834-c69960f0302a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1491146179969-d674118945ff?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-018",
    ownerId: "user-018",
    name: "أدوات السفر",
    subdomain: "travel-gear",
    status: EStoreStatus.Active,
    description: "شنط وإكسسوارات سفر عملية للرحلات اليومية والطويلة.",
    businessAddress: "شرم الشيخ",
    logoUrl:
      "https://images.unsplash.com/photo-1502920917128-1aa500764b2a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1502920917128-1aa500764b2a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-019",
    ownerId: "user-019",
    name: "البيت العصري",
    subdomain: "modern-home",
    status: EStoreStatus.Active,
    description: "أثاث وديكورات تناسب التصميم الداخلي الحديث.",
    businessAddress: "الأقصر",
    logoUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
  {
    id: "store-020",
    ownerId: "user-020",
    name: "مستلزمات الهوايات",
    subdomain: "hobby-supplies",
    status: EStoreStatus.Active,
    description: "منتجات للهوايات والإبداع والأعمال اليدوية.",
    businessAddress: "مرسى مطروح",
    logoUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=200&h=200",
    coverBannerUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=1200&h=500",
  },
];

interface store {
    id: string;
    ownerId: string;
    name: string;
    subdomain: string;
    status: string;
    description: string | null;
    logoUrl: string | null;
    coverBannerUrl: string | null;
    businessAddress: string | null;
    vatNumber: string | null;
    themeSettings: unknown | null;
    createdAt: Date | null;
    deletedAt: Date | null;
    
}
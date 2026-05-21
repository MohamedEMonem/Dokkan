declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      name?: string | null;
      role?: string;
      isVerified?: boolean;
      deletedAt?: Date | null;
      contactNumber?: string | null;
      profilePhotoUrl?: string | null;
      createdAt?: Date;
    };
    token?: string;
    store?: {
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
    };
  }
}

export {};
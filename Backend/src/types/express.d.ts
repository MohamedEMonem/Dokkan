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
  }
}

export {};
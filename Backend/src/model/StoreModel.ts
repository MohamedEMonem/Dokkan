import type { StoreStatus } from "@prisma/client";

export interface StoreModel {
	id: string;
	ownerId: string;
	name: string;
	subdomain: string;
	status: StoreStatus;
	description: string | null;
	logoUrl: string | null;
	coverBannerUrl: string | null;
	businessAddress: string | null;
	vatNumber: string | null;
	themeSettings: unknown | null;
	createdAt: Date | null;
	deletedAt: Date | null;
}

export interface CreateStoreInput {
	ownerId: string;
	name: string;
	subdomain: string;
	status?: StoreStatus;
	description?: string | null;
	logoUrl?: string | null;
	coverBannerUrl?: string | null;
	businessAddress?: string | null;
	vatNumber?: string | null;
	themeSettings?: unknown;
}

export interface UpdateStoreInput {
	name?: string;
	subdomain?: string;
	status?: StoreStatus;
	description?: string | null;
	logoUrl?: string | null;
	coverBannerUrl?: string | null;
	businessAddress?: string | null;
	vatNumber?: string | null;
	themeSettings?: unknown;
	deletedAt?: Date | null;
}

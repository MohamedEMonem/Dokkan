import { IPlan } from "@/types/entities/subscription.types";
import { IStore } from "@/types/entities/store.types";

export type GetOwnerStorePlanDTO = {
  store: Pick<IStore, "id" | "name" | "subdomain" | "status">;
  subscription: {
    id: string;
    status: string;
    nextBillingDate: Date | null;
    plan: IPlan;
  } | null;
};

import { IStore } from "@/types/entities/store.types";

/** Create Store DTO */
export interface CreateStoreDTO {
  data: Omit<
    IStore,
    | "id"
    | "ownerId"
    | "status"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  >;
}

/** Update Store DTO */
export interface UpdateStoreDTO {
  data: Partial<CreateStoreDTO["data"]>;
}

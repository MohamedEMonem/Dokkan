import { IUser } from "@/types/entities/user.types";

/** Register DTO */
export type RegisterDTO = Pick<IUser, "name" | "email" | "password" | "role">;

/** Login DTO */
export type LoginDTO = Pick<IUser, "email" | "password">;


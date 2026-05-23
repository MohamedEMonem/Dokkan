/** Update Profile DTO */
export type UpdateProfileDTO = FormData | {
  name?: string;
  contactNumber?: string | null;
};

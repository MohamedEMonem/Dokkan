import type { Request, Response } from "express";
import {
  sendError,
  sendServerError,
  sendSuccess,
  sendUnauthorized,
} from "../../utils/response.js";
import { authService } from "../../services/AuthService.js";
import { userService } from "../../services/UserService.js";
import { deletePublicImg, uploadPublicImg } from "../../services/imgStorageService.js";
import {
  loginAuthSchema,
  otpSchema,
  registerAuthSchema,
} from "../../DTO/auth.dto.js";
import { patchProfileSchema } from "../../DTO/user.dto.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getPayload(req: Request): Record<string, unknown> | null {
  if (!isRecord(req.body)) return null;

  const data = req.body.data;
  if (data !== undefined) {
    return isRecord(data) ? data : null;
  }

  return req.body;
}

type UploadedImage = {
  buffer: Buffer;
  originalname: string;
};

export const register = async (req: Request, res: Response) => {
  try {
    const payload = getPayload(req);
    if (!payload) {
      return sendError(res, "Invalid request body", 400);
    }

    const validation = registerAuthSchema.safeParse(payload);
    if (!validation.success) {
      return sendError(res, validation.error.issues[0]?.message || "Invalid request body", 400, validation.error.format());
    }

    const otp = authService.generateOtp ? authService.generateOtp() : "000000";
    const result = await authService.register(validation.data, otp);
    return sendSuccess(
      res,
      { user: result.user, token: result.token },
      result.message,
      result.statusCode,
    );
  } catch (error) {
    const cause = error as Error & { statusCode?: number };
    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Internal server error", error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const payload = getPayload(req);
    if (!payload) {
      return sendError(res, "Invalid request body", 400);
    }
    const validation = loginAuthSchema.safeParse(payload);
    if (!validation.success) {
      return sendError(res, validation.error.issues[0]?.message || "Please provide email and password", 400, validation.error.format());
    }

    const result = await authService.login(validation.data);
    return sendSuccess(
      res,
      { user: result.user, token: result.token },
      result.message,
      result.statusCode,
    );
  } catch (error) {
    const cause = error as Error & { statusCode?: number };
    if (cause.statusCode) {
      return sendError(res, cause.message, cause.statusCode);
    }

    return sendServerError(res, "Internal server error", error);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return sendUnauthorized(res, "Refresh token is missing.");
    }
    const result = await authService.refresh(refreshToken);
    res.cookie("refreshToken", result.refreshToken, { httpOnly: true, path: "/api/auth" });

    return sendSuccess(
      res,
      { user: result.user, token: result.token },
      result.message,
      result.statusCode,
    );
  } catch (error) {
    const cause = error as Error;
    if (cause.name === "JsonWebTokenError") {
      return sendUnauthorized(res, "Invalid refresh token.");
    }
    if (cause.name === "TokenExpiredError") {
      return sendUnauthorized(res, "Refresh token expired.");
    }

    const typedError = error as Error & { statusCode?: number };
    if (typedError.statusCode) {
      return sendError(res, typedError.message, typedError.statusCode);
    }

    return sendServerError(res, "Internal server error", error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await authService.logout(req.cookies?.refreshToken);
    return sendSuccess(res, null, "Logged out successfully");
  } catch (error) {
    return sendServerError(res, "Internal server error", error);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await userService.getProfile(req.user!.id);
    return sendSuccess(res, { user }, "Profile retrieved successfully");
  } catch (error) {
    const typedError = error as Error & { statusCode?: number };
    if (typedError.statusCode) {
      return sendError(res, typedError.message, typedError.statusCode);
    }

    return sendServerError(res, "Internal server error", error);
  }
};

export const patchProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const uploadRequest = req as Request & { file?: UploadedImage };
    const payload = getPayload(req);

    if (!payload) {
      return sendError(res, "Invalid request body", 400);
    }
    const validation = patchProfileSchema.safeParse(payload);
    if (!validation.success) {
      return sendError(res, validation.error.issues[0]?.message || "Invalid request body", 400, validation.error.format());
    }

    const existingUser = await userService.getProfile(userId);
    const updateData: {
      name?: string;
      contactNumber?: string | null;
      profilePhotoUrl?: string | null;
    } = { ...validation.data };

    let uploadedImageUrl: string | null = null;

    try {
      if (uploadRequest.file) {
        uploadedImageUrl = await uploadPublicImg(
          uploadRequest.file,
          req.user?.email ?? "unknown",
          req.user?.role ?? "user",
          "profile",
        );
        updateData.profilePhotoUrl = uploadedImageUrl;
      }

      const user = await userService.patchProfile(userId, updateData);

      if (uploadedImageUrl && existingUser.profilePhotoUrl && existingUser.profilePhotoUrl !== uploadedImageUrl) {
        try {
          await deletePublicImg(existingUser.profilePhotoUrl);
        } catch (cleanupError) {
          console.warn("Failed to delete previous profile image after update", cleanupError);
        }
      }

      return sendSuccess(res, { user }, "Profile updated successfully");
    } catch (updateError) {
      if (uploadedImageUrl) {
        try {
          await deletePublicImg(uploadedImageUrl);
        } catch (cleanupError) {
          console.warn("Failed to cleanup uploaded profile image after update error", cleanupError);
        }
      }

      throw updateError;
    }
  } catch (error) {
    const typedError = error as Error & { statusCode?: number };
    if (typedError.statusCode) {
      return sendError(res, typedError.message, typedError.statusCode);
    }

    return sendServerError(res, "Internal server error", error);
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    await userService.deleteAccount(req.user!.id);
    return sendSuccess(res, null, "Account deleted successfully");
  } catch (error) {
    const typedError = error as Error & { statusCode?: number };
    if (typedError.statusCode) {
      return sendError(res, typedError.message, typedError.statusCode);
    }

    return sendServerError(res, "Internal server error", error);
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const validation = otpSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError(res, validation.error.issues[0]?.message || "OTP is required", 400, validation.error.format());
    }

    await authService.verifyOtp(req.user!, validation.data.otp);
    return sendSuccess(res, null, "Email verified successfully!");
  } catch (error) {
    const typedError = error as Error & { statusCode?: number };
    if (typedError.statusCode) {
      return sendError(res, typedError.message, typedError.statusCode);
    }

    return sendServerError(res, "Verification failed", error);
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    await authService.resendOtp(req.user!);
    return sendSuccess(
      res,
      null,
      "A new verification code has been sent to your email.",
    );
  } catch (error) {
    const typedError = error as Error & { statusCode?: number };
    if (typedError.statusCode) {
      return sendError(res, typedError.message, typedError.statusCode);
    }

    return sendServerError(
      res,
      "Internal server error during OTP resend.",
      error,
    );
  }
};

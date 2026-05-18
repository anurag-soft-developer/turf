import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";

export type MediaUploadPurpose =
  | "postMedia"
  | "avatar"
  | "turfMedia"
  | "teamMedia";

export interface PresignedUploadInfo {
  uploadUrl: string;
  publicUrl: string;
  objectKey: string;
}

export const hostStorageApi = {
  requestUploadUrl: async (params: {
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    purpose: MediaUploadPurpose;
    idempotencyKey?: string;
  }): Promise<PresignedUploadInfo> => {
    const response = await api.post<PresignedUploadInfo>(
      API_CONFIG.ENDPOINTS.STORAGE.UPLOAD_URL,
      params,
    );
    return response.data;
  },

  uploadFile: async (
    file: File,
    purpose: MediaUploadPurpose = "turfMedia",
  ): Promise<string> => {
    const presigned = await hostStorageApi.requestUploadUrl({
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      purpose,
    });

    await fetch(presigned.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "application/octet-stream" },
    });

    return presigned.publicUrl;
  },

  deleteObjects: async (objectKeys: string[]) => {
    const response = await api.delete(API_CONFIG.ENDPOINTS.STORAGE.OBJECTS, {
      data: { objectKeys },
    });
    return response.data;
  },
};

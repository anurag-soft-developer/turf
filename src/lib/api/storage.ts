import api from "@/lib/api/client";
import { API_CONFIG } from "@/lib/constants/api";

export type MediaUploadPurpose =
  | "postMedia"
  | "avatar"
  | "turfMedia"
  | "teamMedia"
  | "withdrawalAttachment";

export interface PresignedUploadInfo {
  uploadUrl: string;
  publicUrl: string;
  objectKey: string;
}

interface PresignedUploadApiResponse {
  uploadUrl: string;
  fileUrl: string;
  objectKey: string;
}

function toPresignedUploadInfo(
  data: PresignedUploadApiResponse,
): PresignedUploadInfo {
  return {
    uploadUrl: data.uploadUrl,
    publicUrl: data.fileUrl,
    objectKey: data.objectKey,
  };
}

export const storageApi = {
  requestUploadUrl: async (params: {
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    purpose: MediaUploadPurpose;
    idempotencyKey?: string;
  }): Promise<PresignedUploadInfo> => {
    const response = await api.post<PresignedUploadApiResponse>(
      API_CONFIG.ENDPOINTS.STORAGE.UPLOAD_URL,
      params,
    );
    return toPresignedUploadInfo(response.data);
  },

  uploadFile: async (
    file: File,
    purpose: MediaUploadPurpose = "turfMedia",
  ): Promise<string> => {
    const presigned = await storageApi.requestUploadUrl({
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      purpose,
    });

    await fetch(presigned.uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "x-amz-acl": "public-read",
      },
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

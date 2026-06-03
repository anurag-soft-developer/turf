import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export function toastError(error: unknown, defaultMessage: string) {
  toast.error(getErrorMessage(error, defaultMessage));
}

export function toastSuccess(message: string) {
  toast.success(message);
}

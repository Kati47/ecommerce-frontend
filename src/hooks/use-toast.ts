type ToastVariant = "default" | "destructive";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
};

type UseToastResult = {
  toast: (options: ToastOptions) => void;
};

export function useToast(): UseToastResult {
  const toast = ({ title, description, variant }: ToastOptions) => {
    // Minimal fallback: log to console to avoid runtime errors
    const tag = variant === "destructive" ? "ERROR" : "INFO";
    if (title || description) {
      console.log(`[${tag}] ${title ?? ""} ${description ?? ""}`.trim());
    }
  };

  return { toast };
}
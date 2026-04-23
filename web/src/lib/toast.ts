import { toast } from 'sonner';

export const showSuccess = (msg: string) => toast.success(msg);
export const showError = (msg: string) => toast.error(msg);
export const showInfo = (msg: string) => toast.info(msg);
export const showWarning = (msg: string) => toast.warning(msg);

export const showPromise = <T>(
  promise: Promise<T>,
  msgs: { loading: string; success: string; error: string }
) => {
  return toast.promise(promise, {
    loading: msgs.loading,
    success: () => msgs.success,
    error: (err: any) => err?.message || msgs.error,
  });
};

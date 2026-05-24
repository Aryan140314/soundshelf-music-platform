import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);

const ICONS = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((payload) => {
    const id = crypto.randomUUID();
    const nextToast = {
      id,
      title: payload.title,
      message: payload.message,
      variant: payload.variant || "info",
    };

    setToasts((current) => [...current, nextToast]);

    window.setTimeout(() => removeToast(id), payload.duration || 3200);
  }, [removeToast]);

  const value = useMemo(
    () => ({
      showToast,
      success: (title, message) => showToast({ title, message, variant: "success" }),
      error: (title, message) => showToast({ title, message, variant: "error" }),
      info: (title, message) => showToast({ title, message, variant: "info" }),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(100%,22rem)] flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.variant] || ICONS.info;

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                className="pointer-events-auto glass-panel rounded-2xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-white/10 p-2">
                    <Icon className="text-lg text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-sm font-bold text-white">{toast.title}</p>
                    {toast.message ? (
                      <p className="mt-1 text-sm text-slate-300">{toast.message}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    className="rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <FiX />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToastContext must be used within ToastProvider");
  }

  return context;
}

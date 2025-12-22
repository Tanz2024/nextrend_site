"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Toast } from "./Toast";

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setMessage(text);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-8 left-1/2 z-[120] -translate-x-1/2">
        {message ? (
          <Toast message={message} onClose={() => setMessage(null)} />
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

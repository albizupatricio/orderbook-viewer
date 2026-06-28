import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export const ErrorToast = ({ message, onClose }: ErrorToastProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        role="alert"
        aria-live="assertive"
        className="fixed top-4 left-1/2 -translate-x-1/2 bg-ov-error/40 border border-ov-error/60 text-ov-default ov-mono-xs px-6 py-3 z-50 whitespace-nowrap flex items-center gap-4"
      >
        {message}
        <button
          aria-label="Close"
          onClick={onClose}
          className="text-ov-default hover:opacity-70 cursor-pointer"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

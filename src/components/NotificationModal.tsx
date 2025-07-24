import React, { useEffect } from "react";
import { CheckCircle, X, AlertCircle } from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "warning";
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  title,
  message,
  type = "success",
  onClose,
  autoClose = true,
  autoCloseDelay = 3000,
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          textColor: "text-green-600",
          bgClass: "bg-green-50",
          borderColor: "border-green-500",
          progressColor: "bg-green-500",
        };
      case "error":
        return {
          icon: <X className="w-6 h-6" />,
          textColor: "text-red-600",
          bgClass: "bg-red-50",
          borderColor: "border-red-500",
          progressColor: "bg-red-500",
        };
      case "warning":
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          textColor: "text-yellow-600",
          bgClass: "bg-yellow-50",
          borderColor: "border-yellow-500",
          progressColor: "bg-yellow-500",
        };
      default:
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          textColor: "text-blue-600",
          bgClass: "bg-blue-50",
          borderColor: "border-blue-500",
          progressColor: "bg-blue-500",
        };
    }
  };

  const { icon, textColor, bgClass, borderColor, progressColor } =
    getIconAndColor();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
      <div
        className={`bg-white rounded-lg p-6 max-w-sm w-full mx-4 ${bgClass} border-l-4 ${borderColor} animate-pulse`}
      >
        <div className="flex items-start gap-3">
          <div className={textColor}>{icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {autoClose && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
              <div
                className={`h-1 rounded-full ${progressColor} transition-all ease-linear`}
                style={{
                  width: "0%",
                  animation: `progress ${autoCloseDelay}ms linear`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `,
        }}
      />
    </div>
  );
};

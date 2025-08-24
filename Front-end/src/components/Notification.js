import React from "react";

export default function Notification({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div
      className={`fixed top-5 right-5 z-50 min-w-[200px] px-6 py-3 rounded-lg shadow-lg font-medium cursor-pointer transition-all duration-300
        ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}
      `}
      onClick={onClose}
      role="alert"
    >
      {message}
    </div>
  );
}

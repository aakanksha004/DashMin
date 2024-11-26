import React from "react";
import { Close as CloseIcon } from "@mui/icons-material"; // Import Close icon from MUI

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-6 lg:px-8">
  <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg p-4 sm:p-6 relative">
    {/* Close Button */}
    <button
      className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-500 hover:text-gray-700"
      onClick={onClose}
    >
      <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>

    {/* Modal Content */}
    {children}
  </div>
</div>
  );
};

export default Modal;


import React from "react";

const ConfirmationModal = ({
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  disabled = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-lg p-6 shadow-2xl">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <hr className="border-t border-gray-300 my-4" />
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <hr className="border-t border-gray-300 my-4" />

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={onCancel}
            className="bg-gray-400 text-white py-3 rounded-lg font-medium cursor-pointer"
            disabled={disabled}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white py-3 rounded-lg font-semibold cursor-pointer"
            disabled={disabled}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

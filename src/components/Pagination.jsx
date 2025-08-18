import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Ubah kondisi di baris ini
  if (totalPages < 1) return null;

  return (
    <div className="flex justify-end items-center space-x-2 mt-4 w-full max-w-6xl md:mr-8">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
      >
        <IoIosArrowBack className="w-5 h-5" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 rounded ${
            currentPage === i + 1
              ? "bg-primary text-white font-medium"
              : "bg-gray-200 font-medium"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
      >
        <IoIosArrowForward className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;

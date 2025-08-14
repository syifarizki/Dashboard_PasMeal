import React, { useState } from "react";

const InputPrice = ({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  errorMessage = "",
}) => {
  const hasError = errorMessage.length > 0;
  const [isFocused, setIsFocused] = useState(false);

  // Validasi input: hanya angka dan titik
  const validate = (e) => {
    let val = e.target.value;
    // Hanya angka dan titik, hapus karakter lain
    if (/^[\d.]*$/.test(val)) {
      onChange?.(val);
    }
  };

  // Format harga saat tampil: menambahkan titik untuk ribuan
  const formatPrice = (val) => {
    if (!val) return "";
    // Hapus titik dulu
    const numericVal = val.replace(/\./g, "");
    // Tambahkan titik ribuan
    return numericVal.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="relative mb-1">
      {/* Input */}
      <input
        type="text"
        inputMode="numeric"
        className={`
          peer block w-full rounded-lg border px-3 mt-4 py-[0.50rem] outline-none transition-all 
          duration-200 ease-linear min-h-[auto] border-gray-300 focus:placeholder:opacity-100 
          motion-reduce:transition-none pl-10
        `}
        value={formatPrice(value)}
        onChange={validate}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        readOnly={readOnly}
      />

      {/* Floating Label */}
      <label
        className={`
          pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate 
          text-gray-700 transition-all duration-200 ease-out bg-white text-sm
          ${value || isFocused ? "-translate-y-[0.9rem]" : "mt-[0.57rem]"}
          peer-focus:text-gray-700
          motion-reduce:transition-none
        `}
      >
        {label}
      </label>

      {/* Rp prefix */}
      {(isFocused || value) && (
        <span className="absolute top-[50%] translate-y-[-50%] left-3 text-gray-600 pointer-events-none text-sm">
          Rp.
        </span>
      )}

      {/* Error Message */}
      {hasError && (
        <div className="text-red-500 flex text-xs mt-1">{errorMessage}</div>
      )}
    </div>
  );
};

export default InputPrice;

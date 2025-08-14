const InputPhone = ({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  errorMessage = "",
}) => {
  const hasError = errorMessage.length > 0;

  const validate = (e) => {
    const newValue = e.target.value;

    // Hanya angka
    if (/^\d*$/.test(newValue)) {
      onChange?.(newValue);
    }
  };

  return (
    <div className="relative mb-1" data-twe-input-wrapper-init>
      <input
        type="text"
        inputMode="numeric"
        className={`
          peer block w-full rounded-lg border px-3 mt-4 py-[0.50rem] outline-none transition-all 
          duration-200 ease-linear min-h-[auto] border-gray-300 focus:placeholder:opacity-100 
          motion-reduce:transition-none [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0
        `}
        value={value}
        onChange={validate}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      <label
        className={`
          pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate 
          text-gray-700 transition-all duration-200 ease-out bg-white text-sm
          ${
            value
              ? "-translate-y-[0.9rem]"
              : "mt-[0.57rem] peer-focus:mt-0 peer-focus:-translate-y-[0.9rem]"
          }
          ${value ? "peer-focus:text-gray-700" : "peer-focus:text-gray-700"}
          motion-reduce:transition-none
        `}
      >
        {label}
      </label>
      {hasError && (
        <div className="text-red-500 flex text-xs">{errorMessage}</div>
      )}
    </div>
  );
};

export default InputPhone;

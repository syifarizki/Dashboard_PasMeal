import React from "react";

const SecondaryButton = ({
  text,
  onClick,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`py-2.5 px-4 rounded-lg font-semibold transition cursor-pointer bg-white shadow-lg text-gray-800  ${className}`}
    >
      {text}
    </button>
  );
};

export default SecondaryButton;

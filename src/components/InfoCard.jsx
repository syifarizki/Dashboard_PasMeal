import React from "react";

const InfoCard = ({
  title,
  icon,
  value,
  bgColor = "bg-primary",
  textColor = "text-white",
}) => {
  return (
    <div
      className={`${bgColor} ${textColor} p-5 md:p-7 lg:p-6 rounded-xl shadow flex flex-col justify-between gap-2`}
    >
      <p className="font-bold text-lg">{title}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-3xl">{icon}</div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
    </div>
  );
}

export default InfoCard;

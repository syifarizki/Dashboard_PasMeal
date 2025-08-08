import React, { useRef } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const ImageUpload = ({ image, onImageChange }) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file); 
    }
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {image ? (
        <div className="relative w-32 h-32">
          <img
            src={image}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg"
          />
          <button
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-xl text-white font-bold shadow-md cursor-pointer"
            type="button"
          >
            <HiOutlinePencilSquare className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleImageClick}
          className="border-2 border-dashed border-gray-400 rounded-lg py-4 px-8 flex flex-col items-center justify-center cursor-pointer shadow-sm"
        >
          <img
            src="/images/upimg.png"
            alt="Upload"
            className="w-12 h-12 mb-2"
          />
          <span className="text-gray-700 text-base">Unggah Gambar</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

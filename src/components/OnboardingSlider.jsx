import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const onboardings = [
  {
    image: "/images/slide1.png",
    text: "Jualan di kantin UNPAS? Sekarang lebih praktis!",
  },
  {
    image: "/images/slide2.png",
    text: "Dukung pembayaran digital tanpa ribet",
  },
  {
    image: "/images/slide3.png",
    text: "Perbarui menu kapan pun",
  },
  {
    image: "/images/slide4.png",
    text: "Pesanan sampai ke tangan pembeli dengan aman",
  },
];

const SliderContent = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % onboardings.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <LazyLoadImage
        src={onboardings[activeIndex].image}
        alt="Ilustrasi"
        effect="blur"
        className="w-[70%] mx-auto max-w-xs md:max-w-sm lg:w-full lg:max-w-sm h-auto object-contain mb-6 lg:mb-8 transition-all duration-500 lg:mx-auto"
      />
      <p className="text-black text-lg md:text-xl font-medium px-4 lg:px-0 lg:mb-8 lg:leading-relaxed text-center">
        {onboardings[activeIndex].text}
      </p>

      {/* Dot Indicator */}
      <div className="flex justify-center gap-2 lg:gap-3 mt-8 lg:mt-0">
        {onboardings.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-orange-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </>
  );
};

export default SliderContent;

import React, { memo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

const BannerSlider = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);

  const bannerImages = [
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_imageslider/views/img/sample-1.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_imageslider/views/img/sample-2.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_imageslider/views/img/sample-1.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_imageslider/views/img/sample-2.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_imageslider/views/img/sample-1.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_imageslider/views/img/sample-2.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_imageslider/views/img/sample-1.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_imageslider/views/img/sample-2.jpg",
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className=" homCatSlider pb-2 pt-3 laptop:pt-5 laptop:pb-5 relative z-[99]">
      <div className="w-[95%] mx-auto">
        <Swiper
          spaceBetween={10}
          loop={true}
          navigation={isDesktop}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Navigation, Autoplay]}
          className="mySwiper"
        >
          {bannerImages?.map((imgSrc, index) => (
            <SwiperSlide key={index}>
              <div className="rounded-xl overflow-hidden">
                <img
                  className="w-full"
                  src={imgSrc}
                  alt={`Banner ${index + 1}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default memo(BannerSlider);

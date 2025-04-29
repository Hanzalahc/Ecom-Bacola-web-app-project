import React, { memo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Navigation, FreeMode } from "swiper/modules";
import { BannerBox } from "../../components";

function AdsSlider({ itemsCount }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);

  const bannerData = [
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-2.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-1.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-2.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-1.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-2.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-1.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-2.jpg",
    "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-1.jpg",
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="py-5 w-full">
      <Swiper
        slidesPerView={itemsCount}
        spaceBetween={20}
        navigation={isDesktop}
        modules={[Navigation, FreeMode]}
        freeMode={true}
        breakpoints={{
          300: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          550: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          900: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1100: {
            slidesPerView: itemsCount,
            spaceBetween: 10,
          },
        }}
        className="smallBtn"
      >
        {bannerData?.map((imgSrc, index) => (
          <SwiperSlide key={index}>
            <BannerBox imgSrc={imgSrc} linkSrc={"/"} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default memo(AdsSlider);

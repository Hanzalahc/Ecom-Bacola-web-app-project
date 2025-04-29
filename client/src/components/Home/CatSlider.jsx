import React, { memo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Navigation, FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";
import useReduxHooks from "../../hooks/useReduxHooks";

const CatSlider = () => {
  const { categories } = useReduxHooks();

  const categoriesData = categories?.categoriesData || [];
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="laptop:pb-8 pt-4  HomeCatSlider">
      <div className="w-[95%] mx-auto">
        <Swiper
          slidesPerView={6}
          spaceBetween={10}
          navigation={isDesktop}
          modules={[Navigation, FreeMode]}
          freeMode={true}
          breakpoints={{
            300: {
              slidesPerView: 4,
              spaceBetween: 5,
            },
            550: {
              slidesPerView: 4,
              spaceBetween: 5,
            },
            900: {
              slidesPerView: 5,
              spaceBetween: 5,
            },
            1100: {
              slidesPerView: 8,
              spaceBetween: 5,
            },
          }}
          className="mySwiper"
        >
          {categoriesData?.length !== 0 ? (
            categoriesData
              .filter((category) => category?.name !== "Default Category")
              .map((category, index) => (
                <SwiperSlide key={category?._id}>
                  <Link to={"/product-listing/" + category?._id}>
                    <div className="p-3 bg-white rounded-sm text-center flex items-center justify-center flex-col">
                      <img
                        className="laptop:w-32 w-10"
                        src={
                          category?.image?.url ||
                          "https://via.placeholder.com/150"
                        }
                        alt={category?.name}
                      />
                      <h3 className="text-base">{category?.name || "Name"}</h3>
                    </div>
                  </Link>
                </SwiperSlide>
              ))
          ) : (
            <SwiperSlide>
              <Link to="/product-listing/">
                <div className="p-3 bg-white rounded-sm text-center flex items-center justify-center flex-col">
                  <img
                    className="w-32"
                    src="https://via.placeholder.com/150"
                    alt="Category 1"
                  />
                  <h3 className="text-base">Category 1</h3>
                </div>
              </Link>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default memo(CatSlider);

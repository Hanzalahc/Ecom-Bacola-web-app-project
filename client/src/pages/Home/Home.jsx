import { memo, useState, useEffect } from "react";
import {
  BannerSlider,
  CatSlider,
  AdsSlider,
  PopularProducts,
  ProductSliderItem,
  BlogSlider,
} from "../../components";
import { LiaShippingFastSolid } from "react-icons/lia";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/free-mode";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useReduxHooks from "../../hooks/useReduxHooks";

function Home() {
  const { products } = useReduxHooks();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const productsData = products?.productsData;

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <BannerSlider />
      <CatSlider />

      {/* Popular Products Section */}
      <PopularProducts />

      {/* Free Shipping and Ads Slider */}
      <section className="laptop:py-4 py-0 pt-0 laptop:pt-8 bg-white">
        <div className="w-[95%] mx-auto  ">
          <div className="tablet:w-[80%] w-full mx-auto py-4 px-4 border border-[#FF5252] flex flex-col laptop:flex-row items-center laptop:justify-between justify-center rounded-md mb-7">
            <div className="flex items-center gap-4">
              <LiaShippingFastSolid className="laptop:text-[3rem] text-3xl" />
              <span className="laptop:text-lg text-base font-semibold uppercase">
                Free Shipping
              </span>
            </div>
            <div>
              <p className="mb-0 font-medium text-center text-sm laptop:text-base ">
                Free delivery now on your first order and over 8000
              </p>
            </div>
            <p className="font-bold laptop:text-lg tablet:text-base text-sm ">
              {" "}
              Only 8000*
            </p>
          </div>
          <AdsSlider itemsCount={4} />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-white py-8">
        <div className="w-[95%] mx-auto">
          <div className="flex items-center justify-between">
            <div className="leftside">
              <h2>Featured Products</h2>
            </div>
          </div>
          <div className="productslider py-5">
            <Swiper
              slidesPerView={5}
              spaceBetween={10}
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
                  slidesPerView: 5,
                  spaceBetween: 10,
                },
              }}
              className="mySwiper"
            >
              {productsData.length > 0 &&
              productsData.some((product) => product.isFeatured) ? (
                productsData
                  .filter((product) => product.isFeatured)
                  .map((product) => (
                    <SwiperSlide key={product._id}>
                      <ProductSliderItem product={product} />
                    </SwiperSlide>
                  ))
              ) : (
                <div>No Featured Products Found</div>
              )}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="bg-white py-8">
        <div className="w-[95%] mx-auto">
          <div className="flex items-center justify-between">
            <div className="leftside">
              <h2>Latest Products</h2>
            </div>
          </div>
          <div className="productslider py-5">
            <Swiper
              slidesPerView={5}
              spaceBetween={10}
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
                  slidesPerView: 5,
                  spaceBetween: 10,
                },
              }}
              className="mySwiper"
            >
              {productsData.map((product) => (
                <SwiperSlide key={product._id}>
                  <ProductSliderItem product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Companies section */}
      <section className="py-6 bg-white">
        <div className="w-[90%] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 border border-[#FF5252] p-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-center flex-col group"
              >
                <LiaShippingFastSolid className="text-5xl group-hover:text-primary transition-all duration-300 group-hover:-translate-y-1" />
                <h4 className="font-semibold mt-3">Free Delivery</h4>
                <p className="text-[0.75rem] text-center">
                  For all orders above 8000 PKR
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Ads Slider */}
      <section className="py-8 bg-white">
        <div className="w-[95%] mx-auto  ">
          <AdsSlider itemsCount={3} />
        </div>
      </section>

      {/* Blog Section */}
      <BlogSlider />
    </>
  );
}

export default memo(Home);

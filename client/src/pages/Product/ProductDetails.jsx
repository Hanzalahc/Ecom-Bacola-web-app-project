import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import {
  BreadCrum,
  ProductRightSideContent,
  ProductSliderItem,
  ProductZoom,
  ProductTab,
} from "../../components";
import useApiSubmit from "../../hooks/useApiSubmit";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/free-mode";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useProvideHooks from "../../hooks/useProvideHooks";
import useReduxHooks from "../../hooks/useReduxHooks";

const ProductDetails = () => {
  const { apis, useParams } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const { products } = useReduxHooks();
  const { productId } = useParams();

  // for lates product slider
  const productsData = products?.productsData;

  const [productData, setProductData] = useState({});
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const reviewsRef = useRef(null);

  const fetchProductData = async () => {
    const response = await apiSubmit({
      url: `${apis().getSingleProduct.url}${productId}`,
      method: apis().getSingleProduct.method,
      showLoadingToast: true,
      successMessage: null,
    });

    if (response.success) {
      setProductData(response?.data);
    }
  };

  const goToReviews = useCallback(() => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Initial Fetch
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductData();
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [productId]);

  return (
    <>
      {/* breadcrum */}
      <BreadCrum />

      <section className="bg-white py-5">
        <div className="w-[95%] mx-auto flex gap-8 flex-col laptop:flex-row items-start laptop:items-center">
          <div className="zoom-leftside laptop:w-[40%] w-full ">
            <ProductZoom product={productData} />
          </div>
          <div className="rightsidecontent w-full laptop:w-[60%] pr-10 pl-10 ">
            <ProductRightSideContent
              product={productData}
              goToReviews={goToReviews}
            />
          </div>
        </div>

        {/* Product Tab */}
        <ProductTab
          product={productData}
          onReviewAdded={fetchProductData}
          reviewsRef={reviewsRef}
        />

        {/* Latest Products */}
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
                  slidesPerView: 6,
                  spaceBetween: 10,
                },
              }}
              className="mySwiper"
            >
              {productsData?.map((product) => (
                <SwiperSlide key={product?._id}>
                  <ProductSliderItem product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
};

export default memo(ProductDetails);

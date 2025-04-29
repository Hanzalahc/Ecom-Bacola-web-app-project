import React, { memo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Navigation, FreeMode } from "swiper/modules";
import { BlogSliderItem } from "../";
function BlogSlider() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);

  const blogs = [
    {
      id: 1,
      img: "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/psblog/b/lg-b-blog-6.jpg",
      title: "Best Smart Watch",
      desc: "Apple Smart Watch / Midnight Aluminum",
      linkTo: "/",
    },
    {
      id: 2,
      img: "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/psblog/b/lg-b-blog-6.jpg",
      title: "Best Smart Watch",
      desc: "Apple Smart Watch / Midnight Aluminum",
      linkTo: "/",
    },
    {
      id: 3,
      img: "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/psblog/b/lg-b-blog-6.jpg",
      title: "Best Smart Watch",
      desc: "Apple Smart Watch / Midnight Aluminum",
      linkTo: "/",
    },
    {
      id: 4,
      img: "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/psblog/b/lg-b-blog-6.jpg",
      title: "Best Smart Watch",
      desc: "Apple Smart Watch / Midnight Aluminum",
      linkTo: "/",
    },
    {
      id: 5,
      img: "https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/psblog/b/lg-b-blog-6.jpg",
      title: "Best Smart Watch",
      desc: "Apple Smart Watch / Midnight Aluminum",
      linkTo: "/",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <section className="py-5 pb-8 pt-0 bg-white">
      <div className="w-[95%] mx-auto">
        <h2 className="mb-4">From the Blog</h2>
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          navigation={isDesktop}
          modules={[Navigation, FreeMode]}
          freeMode={true}
          breakpoints={{
            300: {
              slidesPerView: 1,
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
              slidesPerView: 4,
              spaceBetween: 10,
            },
          }}
          className="blogSlider"
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog.id}>
              <BlogSliderItem blog={blog} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default memo(BlogSlider);

import React, { memo } from "react";
import { IoMdTime } from "react-icons/io";
import { Link } from "react-router-dom";

function BlogSliderItem({ blog }) {
  return (
    <div className="blogitem group">
      <Link to={blog.linkTo}>
        <div className="w-full overflow-hidden rounded-md cursor-pointer relative">
          <img
            className="w-full transition-all group-hover:scale-105 group-hover:rotate-1"
            src={blog.img}
            alt="blog"
          />
          <span className="flex items-center justify-center text-white absolute bottom-4 z-50 right-4 bg-primary rounded-md p-1 text-sm font-medium gap-1">
            <IoMdTime className="text-lg" /> 2 days ago
          </span>
        </div>
      </Link>

      <div className="py-4">
        <h4>{blog.title} </h4>
        <p className="mb-4">{blog.desc}</p>
        <Link className="link" to={blog.linkTo}>
          Read More {"-> "}
        </Link>
      </div>
    </div>
  );
}

export default memo(BlogSliderItem);

import React, { memo } from "react";
import { Link } from "react-router-dom";

function BannerBox({ imgSrc, linkSrc }) {
  return (
    <div className="rounded-lg overflow-hidden group">
      <Link to={linkSrc}>
        <img
          className="w-full group-hover:scale-105 group-hover:rotate-1 transition-all "
          src={imgSrc}
          alt=""
        />
      </Link>
    </div>
  );
}

export default memo(BannerBox);

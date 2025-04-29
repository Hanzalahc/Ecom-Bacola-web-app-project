import React, { memo } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

const BreadCrum = () => {
  return (
    <div className="py-5">
      <div className="w-[95%] mx-auto ">
        <Breadcrumbs className=" " aria-label="breadcrumb">
          <Link
            className="link transition cursor-pointer"
            underline="hover"
            color="inherit"
            to="/"
          >
            Home
          </Link>
          <Link
            className="link transition cursor-pointer"
            underline="hover"
            color="inherit"
            to="/material-ui/getting-started/installation/"
          >
            Fashion
          </Link>
          {/* <Typography sx={{ color: "text.primary" }}>Breadcrumbs</Typography> */}
          <Link
            className="link transition cursor-pointer"
            underline="hover"
            color="inherit"
            to="/material-ui/getting-started/installation/"
          >
            S Series T-Shirt
          </Link>
        </Breadcrumbs>
      </div>
    </div>
  );
};

export default memo(BreadCrum);

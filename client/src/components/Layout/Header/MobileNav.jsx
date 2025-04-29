import { Button } from "@mui/material";
import React, { memo } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { LuFilter } from "react-icons/lu";
import useReduxHooks from "../../../hooks/useReduxHooks";

const MobileNav = () => {
  const { dispatch, sidebarActions, sidebar } = useReduxHooks();
  const location = useLocation();

  const mobileFilterSidebarOpen = sidebar?.mobileFilterSidebarOpen || false;
  const mobileSearchBarOpen = sidebar?.mobileSearchBarOpen || false;

  const toggleFiltersSidebar = () => {
    dispatch(sidebarActions.setMobileFilterSidebar(!mobileFilterSidebarOpen));
  };

  return (
    <div className="mobileNav laptop:hidden bg-white p-1 px-3 w-full flex items-center justify-between fixed bottom-0 left-0 place-items-center gap-0 z-[51]  ">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `link text-sm ${isActive ? "text-primary" : ""}`
        }
      >
        <Button className="flex-col !w-10 !min-w-10 !capitalize !text-gray-700">
          <IoHomeOutline size={18} />
          <span className="text-sm">Home</span>
        </Button>
      </NavLink>

      {location.pathname.startsWith("/product-listing") && (
        <Button
          onClick={toggleFiltersSidebar}
          className={`flex-col !w-10 !min-w-10 !h-10  !rounded-full  !capitalize !text-gray-700  ${
            mobileFilterSidebarOpen ? "!bg-primary" : ""
          }`}
        >
          <LuFilter size={18} />
        </Button>
      )}

      <Button
        onClick={() =>
          dispatch(sidebarActions.setMobileSearchBar(!mobileSearchBarOpen))
        }
        className="flex-col !w-10 !min-w-10 !capitalize !text-gray-700"
      >
        <IoSearch size={18} />
        <span className="text-sm">Search</span>
      </Button>
      <NavLink
        to="/my-wishlist"
        className={({ isActive }) =>
          `link text-sm ${isActive ? "text-primary" : ""}`
        }
      >
        <Button className="flex-col !w-10 !min-w-10 !capitalize !text-gray-700">
          <IoHeartOutline size={18} />
          <span className="text-sm">Wishlist</span>
        </Button>
      </NavLink>
      <NavLink
        to="/my-orders"
        className={({ isActive }) =>
          `link text-sm ${isActive ? "text-primary" : ""}`
        }
      >
        <Button className="flex-col !w-10 !min-w-10 !capitalize !text-gray-700">
          <IoBagCheckOutline size={18} />
          <span className="text-sm">Orders</span>
        </Button>
      </NavLink>
      <NavLink
        to="/my-profile"
        className={({ isActive }) =>
          `link text-sm ${isActive ? "text-primary" : ""}`
        }
      >
        <Button className="flex-col !w-10 !min-w-10 !capitalize !text-gray-700">
          <FaRegUser size={18} />
          <span className="text-sm">User</span>
        </Button>
      </NavLink>
    </div>
  );
};

export default memo(MobileNav);

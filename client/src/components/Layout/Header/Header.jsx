import { memo, useEffect } from "react";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useReduxHooks from "../../../hooks/useReduxHooks";
import {
  CategoryDrawer,
  Search,
  AddToCartDrawer,
  LoginProfile,
  MobileNav,
} from "../../";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaCodeCompare, FaRegHeart } from "react-icons/fa6";
import { RiMenu2Fill } from "react-icons/ri";
import { GoRocket } from "react-icons/go";
import { LiaAngleDownSolid } from "react-icons/lia";
import useApiSubmit from "../../../hooks/useApiSubmit";
import { useLocation } from "react-router-dom";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

function Header() {
  const { Link, NavLink, Button, useState, useCallback, apis } =
    useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const {
    auth,
    dispatch,
    categoryActions,
    cart,
    wishlistActions,
    wishlist,
    sidebar,
  } = useReduxHooks();
  const location = useLocation();

  const userLoginStatus = auth.status;
  const userData = auth.userData;
  const cartData = cart.cart || [];
  const wishlistData = wishlist?.wishlist || [];
  const [categories, setCategories] = useState([]);
  const mobileSearchBarOpen = sidebar?.mobileSearchBarOpen || false;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const openCategoryDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, [isDrawerOpen]);

  const openCartDrawer = () => {
    setIsCartDrawerOpen(true);
  };

  const fetchCategories = async () => {
    const response = await apiSubmit({
      url: apis().getAllCategories.url,
      method: apis().getAllCategories.method,
      showLoadingToast: true,
      successMessage: null,
    });

    if (response.success) {
      setCategories(response.data);
      dispatch(categoryActions.setcategories(response.data));
    }
  };

  // intial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setIsCartDrawerOpen(false);
  }, [location]);

  return (
    <>
      <header className="bg-white">
        {/* Top Bar */}
        <div className="py-2  border-y-2 border-solid border-gray-200">
          <div className="w-[95%] mx-auto">
            <div className="flex items-center justify-between">
              <div className="w-[50%] hidden laptop:block">
                <p>Get 50% off on orders above 8000. Limited time offer</p>
              </div>
              <div className="flex items-center justify-between w-full laptop:w-[50%] laptop:justify-end ">
                <ul className="flex items-center gap-3 w-full laptop:w-52 justify-between">
                  <li>
                    <Link
                      className="link text-[0.8rem] laptop:text-sm font-medium"
                      to="#"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="link text-[0.8rem] laptop:text-sm font-medium"
                      to="/my-orders"
                    >
                      Order Tracking
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Row */}
        <div className="laptop:py-4 py-2 border-b-2 border-solid border-gray-200">
          <div className="w-[95%] mx-auto flex items-center justify-between ">
            <div className="laptop:w-[30%] w-[50%]">
              <Link to="/">
                <img src="/assets/logo.jpg" alt="Logo" />
              </Link>
            </div>

            <div
              className={`laptop:w-[40%] fixed top-0 left-0 w-full laptop:h-full laptop:static p-2 laptop:p-0 bg-white z-50  laptop:block transition-all duration-300 ${
                mobileSearchBarOpen ? "block" : "hidden"
              }`}
            >
              <Search />
            </div>

            <div className="w-[35%] flex items-center   pl-7">
              <ul className="flex w-full items-center justify-end gap-0 laptop:gap-3">
                {userLoginStatus ? (
                  <LoginProfile />
                ) : (
                  <li className="">
                    <Link to="/login" className="link">
                      Login
                    </Link>{" "}
                    |{" "}
                    <Link to="/register" className="link">
                      Register
                    </Link>
                  </li>
                )}
                <li>
                  <Tooltip title="Cart" arrow>
                    <StyledBadge
                      badgeContent={cartData.length || 0}
                      color="secondary"
                    >
                      <IconButton aria-label="cart" onClick={openCartDrawer}>
                        <MdOutlineShoppingCart />
                      </IconButton>
                    </StyledBadge>
                  </Tooltip>
                </li>

                <li className="laptop:block hidden">
                  <Link to="/my-wishlist">
                    <Tooltip title="Wishlist" arrow>
                      <StyledBadge
                        badgeContent={wishlistData?.length}
                        color="secondary"
                      >
                        <IconButton aria-label="cart">
                          <FaRegHeart />
                        </IconButton>
                      </StyledBadge>
                    </Tooltip>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="py-2 navigation">
          <div className="w-[95%] mx-auto flex items-center laptop:justify-end laptop:gap-8 gap-3">
            <div className="laptop:w-[20%] w-full">
              <Button
                onClick={openCategoryDrawer}
                className="!text-black gap-1 !w-full laptop:!font-bold !font-semibold !capitalize tablet:!text-sm !text-xs laptop:!text-base "
              >
                <RiMenu2Fill className="text-base "></RiMenu2Fill>Shop By
                Category
                <LiaAngleDownSolid className="text-sm ml-auto font-bold"></LiaAngleDownSolid>
              </Button>
            </div>
            <div className="laptop:w-[60%] w-full">
              <ul className="flex items-center gap-5 relative">
                <li>
                  <NavLink
                    to={"/"}
                    className={({ isActive }) =>
                      `link text-sm ${isActive ? "text-primary" : ""}`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                {categories.length !== 0 ? (
                  categories
                    .filter((category) => category.name !== "Default Category")
                    .slice(0, 10)
                    .map((category) => (
                      <li key={category._id} className="relative group">
                        {/* Category Name */}
                        <NavLink
                          to={`/product-listing/${category._id}`}
                          className={({ isActive }) =>
                            `link text-sm ${isActive ? "text-primary" : ""}`
                          }
                        >
                          {category.name}
                        </NavLink>

                        {/* Dropdown for Subcategories */}
                        {/* {category.subCategories?.length > 0 && (
                          <ul className="absolute left-0 top-full bg-white shadow-md rounded-md py-2 hidden group-hover:block">
                            {category.subCategories.map((subCategory) => (
                              <li key={subCategory._id}>
                                <NavLink
                                  to={`/product-listing/${subCategory._id}`}
                                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                  {subCategory.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )} */}
                      </li>
                    ))
                ) : (
                  <li>
                    <NavLink
                      to={"/product-listing"}
                      className={({ isActive }) =>
                        `link text-sm ${isActive ? "text-primary" : ""}`
                      }
                    >
                      No Category
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>

            <div className="w-[20%] hidden laptop:block">
              <p className="font-medium flex items-center justify-end gap-3 mb-0 mt-0">
                <GoRocket className="text-lg"></GoRocket>
                Free delivery over 2000{" "}
              </p>
            </div>
          </div>
        </nav>
      </header>

      {/* Category Drawer */}
      <CategoryDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />

      {/* Add to Cart Drawer */}
      <AddToCartDrawer
        isDrawerOpen={isCartDrawerOpen}
        setIsDrawerOpen={setIsCartDrawerOpen}
      />

      <MobileNav />
    </>
  );
}

export default memo(Header);

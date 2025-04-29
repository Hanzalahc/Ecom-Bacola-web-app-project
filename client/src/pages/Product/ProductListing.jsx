import React, { memo, useCallback, useEffect, useState } from "react";
import {
  ProductListingSidebar,
  ProductListView,
  ProductSliderItem,
} from "../../components";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { IoGridSharp } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import Link from "@mui/material/Link";
import { Button, Tooltip } from "@mui/material";
import Menu from "@mui/material/Menu";
import Pagination from "@mui/material/Pagination";
import MenuItem from "@mui/material/MenuItem";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import useReduxHooks from "../../hooks/useReduxHooks";

const ProductListing = () => {
  const { apis, useParams } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const { products, productActions, dispatch, sidebarActions, sidebar } =
    useReduxHooks();

  const productsData = products?.productsData || [];
  const mobileFilterSidebarOpen = sidebar?.mobileFilterSidebarOpen || false;
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const [productTotalPages, setProductTotalPages] = useState(1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [productView, setProductView] = React.useState("grid");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
  const sortByOpen = Boolean(anchorEl);
  const [productTotalCount, setProductTotalCount] = useState(0);
  const [price, setPrice] = useState([500, 60000]);
  const { categoryId } = useParams();

  const fetchProducts = async (page) => {
    const response = await apiSubmit({
      url: `${apis().getProductsByCategory.url}${categoryId}`,
      method: apis().getProductsByCategory.method,
      query: { pageNum: page },
      showLoadingToast: true,
      successMessage: null,
    });

    if (response.success) {
      dispatch(productActions.setProducts(response.data));
      setProductTotalCount(response.productsCount);
      setProductTotalPages(response.totalPages);
      setPrice([response.priceRange.minPrice, response.priceRange.maxPrice]);
    } else {
      dispatch(productActions.emptyProducts());
      setProductTotalCount(0);
      setProductTotalPages(1);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchProducts(productCurrentPage);

    const handleResize = () => {
      setIsDesktop(window.innerWidth > 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [categoryId]);

  const handleSortByClick = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    [anchorEl]
  );

  const handleSortByClose = useCallback(() => {
    setAnchorEl(null);
  }, [anchorEl]);

  const handleSortByLowtoHigh = () => {
    dispatch(productActions.sortByPriceLowToHigh());
    handleSortByClose();
  };

  const handleSortByHighToLow = () => {
    dispatch(productActions.sortByPriceHighToLow());
    handleSortByClose();
  };

  const handleSortByNameAtoZ = () => {
    dispatch(productActions.sortByNameAtoZ());
    handleSortByClose();
  };

  const handleProductPageChange = (event, page) => {
    setProductCurrentPage(page);
    fetchProducts(page);
  };

  const handleSortByNameZtoA = () => {
    dispatch(productActions.sortByNameZtoA());
    handleSortByClose();
  };

  return (
    <section className="py-5 pb-0">
      {/* breadcrum */}
      <div className="w-[95%] mx-auto ">
        <Breadcrumbs className="cursor-pointer " aria-label="breadcrumb">
          <Link
            className="link transition"
            underline="hover"
            color="inherit"
            to="/"
          >
            Home
          </Link>
          <Link
            className="link transition"
            underline="hover"
            color="inherit"
            to="/material-ui/getting-started/installation/"
          >
            Fashion
          </Link>
          {/* <Typography sx={{ color: "text.primary" }}>Breadcrumbs</Typography> */}
        </Breadcrumbs>
      </div>

      <div className="bg-white p-2 mt-4">
        <div className="w-[95%] mx-auto flex gap-3 ">
          {/* SideBar */}
          <div
            id="sidebar"
            className={`sidebar laptop:w-[20%] fixed laptop:static  left-0 w-full laptop:h-full max-h-[80vh]  overflow-auto  bg-white z-[102] laptop:z-[100]  p-3 laptop:p-0 transition-all  duration-300 ease-in-out ${
              mobileFilterSidebarOpen ? "bottom-0" : "-bottom-[100%]"
            } `}
          >
            <ProductListingSidebar
              productCurrentPage={productCurrentPage}
              setProductTotalPages={setProductCurrentPage}
              setProductTotalCount={setProductTotalCount}
              products={productsData}
              setPrice={setPrice}
              price={price}
            />
          </div>

          {!isDesktop && mobileFilterSidebarOpen && (
            <div className="filter_overlay h-full  w-full bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 z-[101]"></div>
          )}
          {/* Product Listing */}
          <div className="right laptop:w-[80%] w-full py-3">
            {/* topBar */}
            <div className="p-2 bg-[#f1f1f1] w-full mb-4 rounded-md flex items-center justify-between">
              <div className="col1 flex items-center">
                <Tooltip title="List View" arrow placement="top">
                  <Button
                    onClick={() => {
                      setProductView("list");
                    }}
                    className="!w-10 !h-10 !min-w-10 !rounded-full !text-black"
                  >
                    <LuMenu
                      className={` ${
                        productView === "list"
                          ? "text-primary"
                          : "text-[rgba(0,0,0,0.7)]"
                      }  `}
                    />
                  </Button>
                </Tooltip>
                <Tooltip title="Grid View" arrow placement="top">
                  <Button
                    onClick={() => {
                      setProductView("grid");
                    }}
                    className="!w-10 !h-10 !min-w-10 !rounded-full !text-black
                  "
                  >
                    <IoGridSharp
                      className={` ${
                        productView === "grid"
                          ? "text-primary"
                          : "text-[rgba(0,0,0,0.7)]"
                      }  `}
                    />
                  </Button>
                </Tooltip>
                <span className="text-sm hidden tablet:block font-medium pl-3 text-[rgba(0,0,0,0.7)]">
                  There are total {productTotalCount} products.
                </span>
              </div>
              <div className="col2 ml-auto flex items-center justify-end gap-3 pr-4">
                <span className="text-sm font-medium pl-3 text-[rgba(0,0,0,0.7)]">
                  Sort By:
                </span>
                <Button
                  id="basic-button"
                  aria-controls={sortByOpen ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={sortByOpen ? "true" : undefined}
                  onClick={handleSortByClick}
                  className="!bg-white !text-sm !text-black !border !border-[#000]"
                >
                  Options
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={sortByOpen}
                  onClose={handleSortByClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    className="!text-sm"
                    onClick={handleSortByLowtoHigh}
                  >
                    Pirce Low to High
                  </MenuItem>
                  <MenuItem
                    className="!text-sm"
                    onClick={handleSortByHighToLow}
                  >
                    Price High to Low
                  </MenuItem>
                  <MenuItem className="!text-sm" onClick={handleSortByNameAtoZ}>
                    Product Name A to Z
                  </MenuItem>
                  <MenuItem className="!text-sm" onClick={handleSortByNameZtoA}>
                    Product Name Z to A
                  </MenuItem>
                </Menu>
              </div>
            </div>
            {/* Product Listing View */}
            <div
              className={`grid grid-cols-1 ${
                productView === "grid"
                  ? "tablet:grid-cols-3 laptop:grid-cols-4 grid-cols-2"
                  : "tablet:grid-cols-1 laptop:grid-cols-1"
              } gap-4`}
            >
              {(productsData?.length > 0 &&
                productsData
                  .filter((product) => product?.status !== "inactive")
                  .map((product) =>
                    productView === "grid" ? (
                      <ProductSliderItem key={product?._id} product={product} />
                    ) : (
                      <ProductListView key={product?._id} product={product} />
                    )
                  )) || <div>No Products Found</div>}
            </div>
            {/* Pagination */}
            <div className="productlistpagination w-full flex justify-center mt-10">
              <Pagination
                count={productTotalPages}
                color="primary"
                page={productCurrentPage}
                onChange={handleProductPageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(ProductListing);

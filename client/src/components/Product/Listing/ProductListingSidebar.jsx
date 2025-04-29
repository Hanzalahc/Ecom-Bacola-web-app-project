import React, { memo, useEffect, useMemo, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Collapse } from "react-collapse";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { Button } from "@mui/material";
import RangeSlider from "react-range-slider-input";
import { useLocation } from "react-router-dom";
import Rating from "@mui/material/Rating";
import "react-range-slider-input/dist/style.css";
import useReduxHooks from "../../../hooks/useReduxHooks";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";
import { LuFilter } from "react-icons/lu";

const ProductListingSidebar = ({
  productCurrentPage,
  setProductTotalCount,
  setProductTotalPages,
  products,
  price,
  setPrice,
}) => {
  const { categories, dispatch, productActions, sidebarActions } =
    useReduxHooks();
  const { apis } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedSubcategory = params.get("subcategory") || "";

  const categoriesData = categories?.categoriesData || [];
  const subCategoriesData =
    categoriesData?.map((category) => category.subCategories) || [];

  const [categoryFilter, setCategoryFilter] = useState([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState(() => {
    return selectedSubcategory ? [selectedSubcategory] : [];
  });
  const [isFeaturedFilter, setIsFeaturedFilter] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sizeFilter, setSizeFilter] = useState([]);
  const [colorFilter, setColorFilter] = useState([]);
  const [ramFilter, setRamFilter] = useState([]);
  const [weightFilter, setWeightFilter] = useState([]);
  const [isShopByCategoryOpen, setIsShopByCategoryOpen] = useState(true);
  const [isShopBySubCategoryOpen, setIsShopBySubCategoryOpen] = useState(true);
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [isRamOpen, setIsRamOpen] = useState(true);
  const [isWeightOpen, setIsWeightOpen] = useState(true);

  const fetchProductsByFilters = async () => {
    const filters = {
      page: productCurrentPage,
      limit: 10,
    };

    if (categoryFilter.length > 0) {
      filters.categoryIds = categoryFilter;
    }

    if (subCategoryFilter.length > 0) {
      filters.subCategory = subCategoryFilter;
    }

    if (isFeaturedFilter) {
      filters.isFeatured = isFeaturedFilter;
    }

    if (ratingFilter > 0) {
      filters.rating = ratingFilter;
    }

    if (sizeFilter.length > 0) {
      filters.size = sizeFilter;
    }

    if (colorFilter.length > 0) {
      filters.color = colorFilter;
    }

    if (ramFilter.length > 0) {
      filters.ram = ramFilter;
    }

    if (weightFilter.length > 0) {
      filters.weight = weightFilter;
    }

    if (price[0] > 0 && price[1] > 0) {
      filters.minPrice = price[0];
      filters.maxPrice = price[1];
    }

    // if no filters are selected then we wont fecth products because its already fetched in parent
    if (Object.keys(filters).length <= 4) {
      return;
    }

    const response = await apiSubmit({
      url: apis().getProductsByFilters.url,
      method: apis().getProductsByFilters.method,
      values: filters,
      showLoadingToast: true,
      successMessage: null,
    });

    if (response.success) {
      dispatch(productActions.setProducts(response.data));
      setProductTotalCount(response.productsCount);
      setProductTotalPages(response.totalPages);
    } else {
      dispatch(productActions.emptyProducts());
      setProductTotalCount(0);
      setProductTotalPages(1);
    }
  };

  const sizes = [
    {
      count: 5,
      label: "Small",
    },
    {
      count: 3,
      label: "Medium",
    },
    {
      count: 3,
      label: "Large",
    },
  ];

  const colors = [
    {
      count: 5,
      label: "Red",
    },
    {
      count: 3,
      label: "Blue",
    },
    {
      count: 3,
      label: "Green",
    },
  ];

  const rams = [
    {
      count: 5,
      label: "2GB",
    },
    {
      count: 3,
      label: "4GB",
    },
    {
      count: 3,
      label: "8GB",
    },
  ];

  const weights = [
    {
      count: 5,
      label: "1kg",
    },

    {
      count: 3,
      label: "2kg",
    },
    {
      count: 3,
      label: "3kg",
    },
  ];

  const shouldShowFilterBySize = useMemo(() => {
    return products?.some(
      (product) => product.productSize && product.productSize.length > 0
    );
  }, [products]);

  const shouldShowFilterByColor = useMemo(() => {
    return products?.some(
      (product) => product.productColor && product.productColor.length > 0
    );
  }, [products]);

  const shouldShowFilterByRam = useMemo(() => {
    return products?.some(
      (product) => product.productRam && product.productRam.length > 0
    );
  }, [products]);

  const shouldShowFilterByWeight = useMemo(() => {
    return products?.some(
      (product) => product.productWeight && product.productWeight.length > 0
    );
  }, [products]);

  const handleCloseSidebar = () => {
    dispatch(sidebarActions.setMobileFilterSidebar(false));
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProductsByFilters();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [
    categoryFilter,
    subCategoryFilter,
    isFeaturedFilter,
    ratingFilter,
    sizeFilter,
    colorFilter,
    ramFilter,
    weightFilter,
    price,
    productCurrentPage,
    selectedSubcategory,
  ]);

  return (
    <aside className="sidebarProductList py-5 static laptop:sticky top-32 pr-0 laptop:pr-5   ">
      {/* by category */}
      <div className="box mt-3">
        <h3 className="mb-3 text-base font-semibold flex items-center pr-5">
          Shop By Category{" "}
          <Button
            className="!w-8 !h-8 !min-w-8 !rounded-full !ml-auto !text-black"
            onClick={() => {
              setIsShopByCategoryOpen(!isShopByCategoryOpen);
            }}
          >
            {isShopByCategoryOpen ? (
              <FaAngleUp className="text-lg ml-auto" />
            ) : (
              <FaAngleDown className="text-lg ml-auto" />
            )}
          </Button>
        </h3>
        <Collapse isOpened={isShopByCategoryOpen}>
          <div className="scroll px-3 relative -left-3">
            {(categoriesData &&
              categoriesData.length > 0 &&
              categoriesData
                .filter((category) => category.name !== "Default Category")
                .map((category) => (
                  <FormControlLabel
                    key={category?._id}
                    slotProps={{
                      typography: {
                        sx: {
                          fontFamily: "inherit",
                          fontSize: "0.875rem",
                          "&.Mui-checked": {
                            color: "#FF5252",
                          },
                        },
                      },
                    }}
                    control={
                      <Checkbox
                        sx={{ "&.Mui-checked": { color: "#FF5252" } }}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          isChecked
                            ? setCategoryFilter([
                                ...categoryFilter,
                                category._id,
                              ])
                            : setCategoryFilter(
                                categoryFilter.filter(
                                  (catId) => catId !== category._id
                                )
                              );
                        }}
                      />
                    }
                    label={category?.name}
                    className="w-full"
                    sx={{ marginBottom: "0rem" }}
                  />
                ))) ||
              "No Categories Available"}
          </div>
        </Collapse>
      </div>
      {/* By Sub category */}
      <div className="box mt-3">
        <h3 className="mb-3 text-base font-semibold flex items-center pr-5">
          Shop By Sub Category
          <Button
            className="!w-8 !h-8 !min-w-8 !rounded-full !ml-auto !text-black"
            onClick={() => {
              setIsShopBySubCategoryOpen(!isShopBySubCategoryOpen);
            }}
          >
            {isShopBySubCategoryOpen ? (
              <FaAngleUp className="text-lg ml-auto" />
            ) : (
              <FaAngleDown className="text-lg ml-auto" />
            )}
          </Button>
        </h3>
        <div className="scroll px-3 relative -left-3">
          <Collapse isOpened={isShopBySubCategoryOpen}>
            {(subCategoriesData &&
              subCategoriesData.length > 0 &&
              subCategoriesData.map((subCategories) =>
                subCategories.map((subCategory) => (
                  <FormControlLabel
                    key={subCategory?._id}
                    slotProps={{
                      typography: {
                        sx: {
                          fontFamily: "inherit",
                          fontSize: "0.875rem",
                          "&.Mui-checked": {
                            color: "#FF5252",
                          },
                        },
                      },
                    }}
                    control={
                      <Checkbox
                        checked={subCategoryFilter.includes(subCategory.name)}
                        sx={{ "&.Mui-checked": { color: "#FF5252" } }}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          isChecked
                            ? setSubCategoryFilter((prev) => [
                                ...prev,
                                subCategory.name,
                              ])
                            : setSubCategoryFilter((prev) =>
                                prev.filter(
                                  (subCat) => subCat !== subCategory.name
                                )
                              );
                        }}
                      />
                    }
                    label={subCategory?.name}
                    className="w-full"
                    sx={{ marginBottom: "0rem" }}
                  />
                ))
              )) ||
              "No Sub Categories Available"}
          </Collapse>
        </div>
      </div>
      {/* by Featured */}
      <div className="box mt-3">
        <h3 className="mb-3 text-base font-semibold flex items-center pr-5">
          Shop By Featured{" "}
          <Button
            className="!w-8 !h-8 !min-w-8 !rounded-full !ml-auto !text-black"
            onClick={() => setIsFeaturedOpen(!isFeaturedOpen)}
          >
            {isFeaturedOpen ? (
              <FaAngleUp className="text-lg ml-auto" />
            ) : (
              <FaAngleDown className="text-lg ml-auto" />
            )}
          </Button>
        </h3>
        <Collapse isOpened={isFeaturedOpen}>
          <div className="scroll px-3 relative -left-3">
            <FormControlLabel
              slotProps={{
                typography: {
                  sx: {
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    "&.Mui-checked": {
                      color: "#FF5252",
                    },
                  },
                },
              }}
              control={
                <Checkbox
                  sx={{ "&.Mui-checked": { color: "#FF5252" } }}
                  onChange={(e) => {
                    setIsFeaturedFilter(e.target.checked);
                  }}
                />
              }
              label="Featured"
              className="w-full"
              sx={{ marginBottom: "0rem" }}
            />
          </div>
        </Collapse>
      </div>

      {/* by Size */}
      {shouldShowFilterBySize && (
        <div className="box mt-3">
          <h3 className="mb-3 text-base font-semibold flex items-center pr-5">
            Shop By Size{" "}
            <Button
              className="!w-8 !h-8 !min-w-8 !rounded-full !ml-auto !text-black"
              onClick={() => setIsSizeOpen(!isSizeOpen)}
            >
              {isSizeOpen ? (
                <FaAngleUp className="text-lg ml-auto" />
              ) : (
                <FaAngleDown className="text-lg ml-auto" />
              )}
            </Button>
          </h3>
          <Collapse isOpened={isSizeOpen}>
            <div className="scroll px-3 relative -left-3">
              {sizes.map((item) => (
                <FormControlLabel
                  key={item.label}
                  slotProps={{
                    typography: {
                      sx: {
                        fontFamily: "inherit",
                        fontSize: "0.875rem",
                        "&.Mui-checked": {
                          color: "#FF5252",
                        },
                      },
                    },
                  }}
                  control={
                    <Checkbox
                      sx={{ "&.Mui-checked": { color: "#FF5252" } }}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        isChecked
                          ? setSizeFilter([...sizeFilter, item.label])
                          : setSizeFilter(
                              sizeFilter.filter((size) => size !== item.label)
                            );
                      }}
                    />
                  }
                  label={item.label}
                  className="w-full"
                  sx={{ marginBottom: "0rem" }}
                />
              ))}
            </div>
          </Collapse>
        </div>
      )}

      {/* by Color */}
      {shouldShowFilterByColor && (
        <div className="box mt-3">
          <h3 className="mb-3 text-base font-semibold flex items-center pr-5">
            Shop By Color{" "}
            <Button
              className="!w-8 !h-8 !min-w-8 !rounded-full !ml-auto !text-black"
              onClick={() => setIsColorOpen(!isColorOpen)}
            >
              {isColorOpen ? (
                <FaAngleUp className="text-lg ml-auto" />
              ) : (
                <FaAngleDown className="text-lg ml-auto" />
              )}
            </Button>
          </h3>
          <Collapse isOpened={isColorOpen}>
            <div className="scroll px-3 relative -left-3">
              {colors.map((item) => (
                <FormControlLabel
                  key={item.label}
                  slotProps={{
                    typography: {
                      sx: {
                        fontFamily: "inherit",
                        fontSize: "0.875rem",
                        "&.Mui-checked": {
                          color: "#FF5252",
                        },
                      },
                    },
                  }}
                  control={
                    <Checkbox
                      sx={{ "&.Mui-checked": { color: "#FF5252" } }}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        isChecked
                          ? setColorFilter([...colorFilter, item.label])
                          : setColorFilter(
                              colorFilter.filter(
                                (color) => color !== item.label
                              )
                            );
                      }}
                    />
                  }
                  label={item.label}
                  className="w-full"
                  sx={{ marginBottom: "0rem" }}
                />
              ))}
            </div>
          </Collapse>
        </div>
      )}

      {/* by Ram */}
      {shouldShowFilterByRam && (
        <div className="box mt-3">
          <h3 className="mb-3 text-base font-semibold flex items-center pr-5">
            Shop By Ram{" "}
            <Button
              className="!w-8 !h-8 !min-w-8 !rounded-full !ml-auto !text-black"
              onClick={() => setIsRamOpen(!isRamOpen)}
            >
              {isRamOpen ? (
                <FaAngleUp className="text-lg ml-auto" />
              ) : (
                <FaAngleDown className="text-lg ml-auto" />
              )}
            </Button>
          </h3>
          <Collapse isOpened={isRamOpen}>
            <div className="scroll px-3 relative -left-3">
              {rams.map((item) => (
                <FormControlLabel
                  key={item.label}
                  slotProps={{
                    typography: {
                      sx: {
                        fontFamily: "inherit",
                        fontSize: "0.875rem",
                        "&.Mui-checked": {
                          color: "#FF5252",
                        },
                      },
                    },
                  }}
                  control={
                    <Checkbox
                      sx={{ "&.Mui-checked": { color: "#FF5252" } }}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        isChecked
                          ? setRamFilter([...ramFilter, item.label])
                          : setRamFilter(
                              ramFilter.filter((ram) => ram !== item.label)
                            );
                      }}
                    />
                  }
                  label={item.label}
                  className="w-full"
                  sx={{ marginBottom: "0rem" }}
                />
              ))}
            </div>
          </Collapse>
        </div>
      )}

      {/* by Weight */}
      {shouldShowFilterByWeight && (
        <div className="box mt-3">
          <h3 className="mb-3 text-base font-semibold flex items-center pr-5">
            Shop By Weight{" "}
            <Button
              className="!w-8 !h-8 !min-w-8 !rounded-full !ml-auto !text-black"
              onClick={() => setIsWeightOpen(!isWeightOpen)}
            >
              {isWeightOpen ? (
                <FaAngleUp className="text-lg ml-auto" />
              ) : (
                <FaAngleDown className="text-lg ml-auto" />
              )}
            </Button>
          </h3>
          <Collapse isOpened={isWeightOpen}>
            <div className="scroll px-3 relative -left-3">
              {weights.map((item) => (
                <FormControlLabel
                  key={item.label}
                  slotProps={{
                    typography: {
                      sx: {
                        fontFamily: "inherit",
                        fontSize: "0.875rem",
                        "&.Mui-checked": {
                          color: "#FF5252",
                        },
                      },
                    },
                  }}
                  control={
                    <Checkbox
                      sx={{ "&.Mui-checked": { color: "#FF5252" } }}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        isChecked
                          ? setWeightFilter([...weightFilter, item.label])
                          : setWeightFilter(
                              weightFilter.filter(
                                (weight) => weight !== item.label
                              )
                            );
                      }}
                    />
                  }
                  label={item.label}
                  className="w-full"
                  sx={{ marginBottom: "0rem" }}
                />
              ))}
            </div>
          </Collapse>
        </div>
      )}

      {/* By price range */}
      <div className="box mt-4 ">
        <h3 className="mb-3 text-base font-semibold flex items-center pr-5">
          Filter by Price
        </h3>
        <RangeSlider
          value={price}
          min={price[0] || 500}
          max={price[1] || 60000}
          step={500}
          onInput={setPrice}
        />
        <div className="flex pt-4 pb-2 ">
          <span>
            From: <span className="font-semibold text-sm">Rs: {price[0]}</span>
          </span>
          <span className="ml-auto">
            To: <span className="font-semibold text-sm">Rs: {price[1]}</span>
          </span>
        </div>
      </div>
      {/* By price Rating */}
      <div className="box mt-4 ">
        <h3 className="mb-3 text-base font-semibold flex items-center pr-5">
          Filter by Rating
        </h3>
        <div className="w-full flex flex-col gap-2 pl-2 laptop:pl-1">
          <Rating
            className="!cursor-pointer"
            name="read-only"
            value={ratingFilter}
            onChange={(event, newValue) => setRatingFilter(newValue)}
            size="small"
          />
        </div>
      </div>

      <Button
        onClick={handleCloseSidebar}
        className="!w-full laptop:!hidden !flex  !capitalize !text-white !bg-primary !rounded-md !mt-3  "
      >
        <LuFilter className="text-white" size={20} />
        Close
      </Button>
    </aside>
  );
};

export default memo(ProductListingSidebar);

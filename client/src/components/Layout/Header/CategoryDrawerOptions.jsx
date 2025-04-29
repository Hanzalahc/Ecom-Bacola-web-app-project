import React, { memo, useState, useCallback } from "react";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FiMinusSquare } from "react-icons/fi";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import useReduxHooks from "../../../hooks/useReduxHooks";

const CategoryDrawerOptions = () => {
  const { categories } = useReduxHooks();
  const categoriesData = categories.categoriesData;

  const [openCategory, setOpenCategory] = useState(null);
  const [openSubCategory, setOpenSubCategory] = useState(null);

  const toggleCategory = useCallback((categoryId) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
  }, []);

  const toggleSubCategory = useCallback((subCategoryId) => {
    setOpenSubCategory((prev) =>
      prev === subCategoryId ? null : subCategoryId
    );
  }, []);

  return (
    <div>
      <ul className="w-full">
        {categoriesData && categoriesData.length !== 0 ? (
          categoriesData
            .filter((category) => category.name !== "Default Category")
            .map((category) => (
              <li
                className="flex items-center relative flex-col"
                key={category._id}
              >
                <Link
                  to={`/product-listing/${category?._id}`}
                  className="w-full"
                >
                  <Button className="w-full !text-left !justify-start !px-3 !text-secondary !font-semibold !text-sm tablet:!text-base laptop:!text-xl !capitalize">
                    {category.name}
                  </Button>
                </Link>
                {openCategory === category._id ? (
                  <FiMinusSquare
                    onClick={() => toggleCategory(category._id)}
                    className="absolute top-2 right-4 cursor-pointer"
                  />
                ) : (
                  <FaRegSquarePlus
                    onClick={() => toggleCategory(category._id)}
                    className="absolute top-2 right-4 cursor-pointer"
                  />
                )}

                {openCategory === category._id && (
                  <ul className="w-full pl-3">
                    {category.subCategories?.map((subCategory) => (
                      <li className="relative" key={subCategory._id}>
                        <Link
                          to={`/product-listing/${category?._id}?subcategory=${subCategory.name}`}
                        >
                          <Button className="w-full !text-left !justify-start !px-3 !text-secondary !font-medium !text-xs tablet:!text-base !capitalize ">
                            {subCategory.name}
                          </Button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
        ) : (
          <li>
            <Link to="/product-listing" className="w-full">
              <Button className="w-full !text-left !justify-start !px-3 !text-secondary !font-semibold !text-xs">
                No Categories Available
              </Button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default memo(CategoryDrawerOptions);

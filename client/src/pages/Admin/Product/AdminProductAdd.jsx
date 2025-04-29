import React, { memo, useState, useEffect, useMemo } from "react";
// import Select from "@mui/material/Select";
import Select from "react-select";
import useReduxHooks from "../../../hooks/useReduxHooks";
import { useForm, Controller } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import { FileUpload, RTE } from "../../../components/";
import { Button } from "@mui/material";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";

const AdminProductAdd = () => {
  const { apis, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { sidebar } = useReduxHooks();
  const isSidebarOpen = sidebar.isSidebarOpen;

  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm();

  const calculateDiscount = useMemo(() => {
    return (price, oldPrice) => {
      if (!price || !oldPrice) return 0;
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    };
  }, []);

  const subCategoryOptions = [
    { value: null, label: "None" },
    ...(categories?.flatMap(
      (category) =>
        category.subCategories?.map((subCategory) => ({
          value: subCategory.name,
          label: subCategory.name,
        })) || []
    ) || []),
  ];

  const handleFormSubmit = async (data) => {
    if (files.length < 5) {
      return showError("5 Product images are required");
    }

    const images = files.map((file) => file);

    const formattedData = {
      name: data?.name.trim().replace(/\s+/g, " "),
      description: data?.description.trim().replace(/\s+/g, " "),
      content: data?.content,
      category: data?.category.value,
      subCategory: data?.subCategory.value,
      brand: data?.brand,
      price: parseInt(data?.price),
      oldPrice: parseInt(data?.oldPrice),
      discount: calculateDiscount(data?.price, data?.oldPrice),
      stock: parseInt(data?.stock),
      isFeatured: data?.isFeatured.value === "true" ? true : false,
      productRam: data?.productRam,
      productColor: data?.productColor,
      productSize: data?.productSize,
      productWeight: data?.productWeight,
      images: images,
    };

    const response = await apiSubmit({
      url: apis().addProduct.url,
      method: apis().addProduct.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Adding Product, please wait...",
    });

    if (response.success) {
      setFiles([]);
      reset();
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      const response = await apiSubmit({
        url: apis().getAllCategories.url,
        method: apis().getAllCategories.method,
        showLoadingToast: true,
        successMessage: null,
      });

      if (response.success) {
        setCategories(response.data);
      }
    };

    fetchCategories();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div
      className={`py-4 px-5 ${
        isSidebarOpen ? "w-[82%] transition-all" : "w-[100%] "
      }`}
    >
      <section className="">
        <h1 className="text-lg font-semibold border-b border-[rgba(0,0,0,0.2)]  ">
          Add Product
        </h1>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="form mt-5 mb-10  "
        >
          <div className=" grid grid-cols-1">
            <div className="col">
              <h3 className="text-base font-medium mb-1">
                Upload 5 Product Images *
              </h3>
              <FileUpload files={files} setFiles={setFiles} limit={5} />
            </div>
          </div>
          <div className=" grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Name *</h3>
              <input
                type="text"
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                {...register("name", {
                  required: true,
                  minLength: {
                    value: 3,
                    message: "Category name must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 100,
                    message: "Category name must not exceed 100 characters",
                  },
                })}
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>
          <div className=" grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-base font-medium mb-1">
                Product Description *
              </h3>
              <textarea
                type="text"
                className="w-full h-36 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                {...register("description", {
                  required: true,
                  minLength: {
                    value: 3,
                    message:
                      "Product description must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 2000,
                    message:
                      "Product description must not exceed 2000 characters",
                  },
                })}
              />
              {errors.description && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
          <div className=" grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-base font-medium mb-1">
                Product Deatiled Description *
              </h3>
              <RTE
                label="Content :"
                name="content"
                control={control}
                defaultValue={getValues("content")}
              />
              {errors.content && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </span>
              )}
            </div>
          </div>
          <div className=" grid grid-cols-3 mb-3 gap-5">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Category *</h3>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full text-sm font-medium"
                    classNamePrefix="select"
                    options={
                      categories?.map((category) => ({
                        value: category.name,
                        label: category.name,
                      })) || []
                    }
                  />
                )}
              />
              {/* <Select
                className="w-full !text-sm !font-medium  "
                size="small"
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Category"
                {...register("category", { required: true })}
              >
                {categories?.map((category) => (
                  <MenuItem
                    key={category._id}
                    className="!text-sm !font-medium"
                    value={category.name}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select> */}

              {errors.category && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </span>
              )}
            </div>
            <div className="col">
              <h3 className="text-base font-medium mb-1">
                Product Sub Category
              </h3>
              <Controller
                name="subCategory"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full text-sm font-medium"
                    classNamePrefix="select"
                    isSearchable={true}
                    options={subCategoryOptions}
                  />
                )}
              />

              {/* <Select
                className="w-full !text-sm !font-medium   "
                size="small"
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Sub Category"
                {...register("subCategory")}
              >
                <MenuItem className="!text-sm !font-medium" value="">
                  <em>None</em>
                </MenuItem>
                {categories?.map((category) =>
                  category.subCategories?.map((subCategory) => (
                    <MenuItem
                      key={subCategory._id}
                      className="!text-sm !font-medium"
                      value={subCategory.name}
                    >
                      {subCategory.name}
                    </MenuItem>
                  ))
                )}
              </Select> */}
              {errors.subCategory && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.subCategory.message}
                </span>
              )}
            </div>
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Brand</h3>
              <input
                type="text"
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                {...register("brand", {
                  minLength: {
                    value: 3,
                    message: "Brand name must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 30,
                    message: "Brand name must not exceed 30 characters",
                  },
                })}
              />
              {errors.brand && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.brand.message}
                </span>
              )}
            </div>
          </div>
          <div className=" grid grid-cols-3 mb-3 gap-5">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Old Price</h3>
              <input
                type="number"
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                step={0.01}
                {...register("oldPrice", {
                  min: {
                    value: 0,
                    message: "Old price must be greater than 0",
                  },
                })}
              />
              {errors.oldPrice && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.oldPrice.message}
                </span>
              )}
            </div>
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Price *</h3>
              <input
                type="number"
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                step={0.01}
                {...register("price", {
                  required: true,
                  min: {
                    value: 0,
                    message: "Price must be greater than 0",
                  },
                })}
              />
              {errors.price && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </span>
              )}
            </div>

            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Stock *</h3>
              <input
                type="number"
                className="w-full h-10 border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm"
                {...register("stock", {
                  required: true,
                  min: {
                    value: 0,
                    message: "Stock must be greater than 0",
                  },
                })}
              />
              {errors.stock && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.stock.message}
                </span>
              )}
            </div>
          </div>
          <div className=" grid grid-cols-4 mb-3 gap-5">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Is Featured * </h3>
              <Controller
                name="isFeatured"
                control={control}
                rules={{ required: "Featured status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full text-sm font-medium"
                    classNamePrefix="select"
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                  />
                )}
              />
              {/* <Select
                className="w-full !text-sm !font-medium  "
                size="small"
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Featured"
                {...register("isFeatured", { required: true })}
              >
                <MenuItem className="!text-sm !font-medium" value={"true"}>
                  Yes
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"false"}>
                  No
                </MenuItem>
              </Select> */}
              {errors.isFeatured && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.isFeatured.message}
                </span>
              )}
            </div>
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Weight </h3>
              <Controller
                name="productWeight"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    className="w-full text-sm font-medium"
                    classNamePrefix="select"
                    options={["1kg", "2kg", "3kg"].map((weight) => ({
                      value: weight,
                      label: weight,
                    }))}
                    onChange={(selected) => {
                      field.onChange(
                        selected ? selected.map((item) => item.value) : []
                      );
                    }}
                    value={
                      field.value
                        ? field.value.map((value) => ({ value, label: value }))
                        : []
                    }
                  />
                )}
              />

              {/* <Select
                multiple
                className="w-full !text-sm !font-medium  "
                size="small"
                value={productWeights}
                onChange={(e) => setProductWeights(e.target.value)}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Weight"
              >
                <MenuItem className="!text-sm !font-medium" value={""}>
                  <em>None</em>
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"1kg"}>
                  1kg
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"2kg"}>
                  2kg
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"3kg"}>
                  3kg
                </MenuItem>
              </Select> */}
            </div>
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Size </h3>
              <Controller
                name="productSize"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    className="w-full text-sm font-medium"
                    classNamePrefix="select"
                    options={["Small", "Medium", "Large"].map((size) => ({
                      value: size,
                      label: size,
                    }))}
                    onChange={(selected) => {
                      field.onChange(
                        selected ? selected.map((item) => item.value) : []
                      );
                    }}
                    value={
                      field.value
                        ? field.value.map((value) => ({ value, label: value }))
                        : []
                    }
                  />
                )}
              />

              {/* <Select
                multiple
                className="w-full !text-sm !font-medium  "
                size="small"
                value={productSizes}
                onChange={(e) => setProductSizes(e.target.value)}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Size"
              >
                <MenuItem className="!text-sm !font-medium" value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"Small"}>
                  Small
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"Medium"}>
                  Medium
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"Large"}>
                  Large
                </MenuItem>
              </Select> */}
            </div>
          </div>
          <div className=" grid grid-cols-2 mb-5 gap-5">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Color </h3>
              <Controller
                name="productColor"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    className="w-full text-sm font-medium"
                    classNamePrefix="select"
                    options={["Red", "Blue", "Green"].map((color) => ({
                      value: color,
                      label: color,
                    }))}
                    onChange={(selected) => {
                      field.onChange(
                        selected ? selected.map((item) => item.value) : []
                      );
                    }}
                    value={
                      field.value
                        ? field.value.map((value) => ({ value, label: value }))
                        : []
                    }
                  />
                )}
              />

              {/* <Select
                multiple
                className="w-full !text-sm !font-medium  "
                size="small"
                value={productColors}
                onChange={(e) => setProductColors(e.target.value)}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Color"
              >
                <MenuItem className="!text-sm !font-medium" value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"Red"}>
                  Red
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"Blue"}>
                  Blue
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"Green"}>
                  Green
                </MenuItem>
              </Select> */}
            </div>

            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Rams </h3>
              <Controller
                name="productRam"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    className="w-full text-sm font-medium"
                    classNamePrefix="select"
                    options={["2GB", "4GB", "8GB"].map((ram) => ({
                      value: ram,
                      label: ram,
                    }))}
                    onChange={(selected) => {
                      field.onChange(
                        selected ? selected.map((item) => item.value) : []
                      );
                    }}
                    value={
                      field.value
                        ? field.value.map((value) => ({ value, label: value }))
                        : []
                    }
                  />
                )}
              />

              {/* <Select
                multiple
                className="w-full !text-sm !font-medium  "
                size="small"
                value={productRams}
                onChange={(e) => setProductRams(e.target.value)}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Rams"
              >
                <MenuItem className="!text-sm !font-medium" value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"2GB"}>
                  2GB
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"4GB"}>
                  4GB
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"8GB"}>
                  8GB
                </MenuItem>
              </Select> */}
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            color="primary"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default memo(AdminProductAdd);

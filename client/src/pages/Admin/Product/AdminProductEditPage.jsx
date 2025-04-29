import React, { memo, useState, useEffect, useMemo } from "react";
import useReduxHooks from "../../../hooks/useReduxHooks";
import Select from "@mui/material/Select";
import { useForm } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import { FileUpload, RTE } from "../../../components/";
import { Button } from "@mui/material";
import useProvideHooks from "../../../hooks/useProvideHooks";
import useApiSubmit from "../../../hooks/useApiSubmit";

const AdminProductEditPage = () => {
  const { apis, showError, useParams } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { sidebar } = useReduxHooks();
  const isSidebarOpen = sidebar.isSidebarOpen;
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({});
  const [productRams, setProductRams] = useState([]);
  const [productColors, setProductColors] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [productWeights, setProductWeights] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("active");
  const { productId } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

  const handleFormSubmit = async (data) => {
    if (files.length < 5) {
      return showError("5 Product images are required");
    }

    const images = files.map((file) => file);

    const arraysAreEqual = (arr1, arr2) =>
      arr1.length === arr2.length &&
      arr1.every((val, index) => val === arr2[index]);

    const areImagesSame = productData.images
      .map((img) => img.publicId)
      .sort()
      .every(
        (publicId, index) =>
          publicId === images.map((img) => img.publicId).sort()[index]
      );

    if (
      productData.name === data.name.trim().replace(/\s+/g, " ") &&
      productData.description ===
        data.description.trim().replace(/\s+/g, " ") &&
      data.content === productData.content &&
      productData.brand === data.brand.trim().replace(/\s+/g, " ") &&
      productData.price === parseInt(data.price) &&
      productData.category.name === category &&
      productData.subCategory === subCategory &&
      productData.oldPrice === parseInt(data.oldPrice) &&
      productData.stock === parseInt(data.stock) &&
      productData.status === status &&
      productData.isFeatured === isFeatured &&
      arraysAreEqual(productData.productRam, productRams) &&
      arraysAreEqual(productData.productColor, productColors) &&
      arraysAreEqual(productData.productSize, productSizes) &&
      arraysAreEqual(productData.productWeight, productWeights) &&
      areImagesSame
    ) {
      return showError("No changes detected");
    }

    const formattedData = {
      name: data?.name.trim().replace(/\s+/g, " "),
      description: data?.description.trim().replace(/\s+/g, " "),
      content: data?.content,
      category: category,
      subCategory: subCategory,
      brand: data?.brand.trim().replace(/\s+/g, " "),
      price: parseInt(data?.price),
      oldPrice: parseInt(data?.oldPrice),
      discount: calculateDiscount(data?.price, data?.oldPrice),
      stock: parseInt(data?.stock),
      status: status,
      isFeatured: isFeatured,
      productRam: productRams,
      productColor: productColors,
      productSize: productSizes,
      productWeight: productWeights,
      images: images,
    };

    const response = await apiSubmit({
      url: `${apis().updateProduct.url}${productId}`,
      method: apis().updateProduct.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Updating Product...",
    });

    if (response.success) {
      setFiles([]);
      reset();
      setProductRams([]);
      setProductColors([]);
      setProductSizes([]);
      setProductWeights([]);
      setCategories([]);
      setIsFeatured(false);
      setCategory("");
      setSubCategory("");
      setProductData({});
    }
  };

  const fetchProductData = async () => {
    const response = await apiSubmit({
      url: `${apis().getSingleProduct.url}${productId}`,
      method: apis().getSingleProduct.method,
      showLoadingToast: true,
      successMessage: null,
    });

    if (response.success) {
      setProductData(response.data);
      setValue("name", response.data.name);
      setValue("description", response.data.description);
      setValue("brand", response.data.brand);
      setValue("price", response.data.price);
      setValue("oldPrice", response.data.oldPrice);
      setValue("stock", response.data.stock);
      setValue("content", response.data.content);
      setValue("rating", response.data.rating);
      setProductRams(response.data.productRam);
      setProductColors(response.data.productColor);
      setProductSizes(response.data.productSize);
      setProductWeights(response.data.productWeight);
      setIsFeatured(response.data.isFeatured);
      setCategory(response.data.category.name);
      setSubCategory(response.data.subCategory);
      setFiles(response.data.images);
      setStatus(response.data.status);
    }
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
    }
  };

  // Initial Fetch
  useEffect(() => {
    const controller = new AbortController();
    fetchProductData();
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
          Update Product
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
              <p className="text-sm text-gray-500 mb-3">
                If you want to update the images, please upload new images.
                Otherwise leave it as it is.
              </p>
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
                    value: 1000,
                    message:
                      "Product description must not exceed 1000 characters",
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
              <Select
                className="w-full !text-sm !font-medium  "
                size="small"
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
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
              </Select>
            </div>
            <div className="col">
              <h3 className="text-base font-medium mb-1">
                Product Sub Category
              </h3>
              <Select
                className="w-full !text-sm !font-medium   "
                size="small"
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                label="Sub Category"
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
              </Select>
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
              <Select
                className="w-full !text-sm !font-medium  "
                size="small"
                value={isFeatured}
                onChange={(e) => setIsFeatured(e.target.value)}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Featured"
              >
                <MenuItem className="!text-sm !font-medium" value={true}>
                  Yes
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={false}>
                  No
                </MenuItem>
              </Select>
            </div>

            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Weight </h3>
              <Select
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
              </Select>
            </div>
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Size </h3>
              <Select
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
              </Select>
            </div>
          </div>
          <div className=" grid grid-cols-3 mb-5 gap-5">
            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Color </h3>
              <Select
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
              </Select>
            </div>

            <div className="col">
              <h3 className="text-base font-medium mb-1">Product Rams </h3>
              <Select
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
              </Select>
            </div>
            <div className="col">
              <h3 className="text-base font-medium mb-1">Status * </h3>
              <Select
                className="w-full !text-sm !font-medium  "
                size="small"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Featured"
              >
                <MenuItem className="!text-sm !font-medium" value={"active"}>
                  Active
                </MenuItem>
                <MenuItem className="!text-sm !font-medium" value={"inactive"}>
                  Inactive
                </MenuItem>
              </Select>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            color="primary"
          >
            {loading ? "Updating Product..." : "Update Product"}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default AdminProductEditPage;

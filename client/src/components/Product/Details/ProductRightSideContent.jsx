import React, { memo, useCallback, useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import { QuantityBox } from "../../";
import { FaRegHeart } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import useReduxHooks from "../../../hooks/useReduxHooks";
import useProvideHooks from "../../../hooks/useProvideHooks";

const ProductRightSideContent = ({ product, goToReviews }) => {
  const { cartActions, dispatch, cart, wishlistActions } = useReduxHooks();
  const { showError } = useProvideHooks();

  const noOfReviews = product?.reviews?.length || 0;
  const cartItems = cart?.cart;
  const findedItem = cartItems?.find((item) => item._id === product?._id);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");

  const handleAddToCart = useCallback(() => {
    if (
      product.productSize &&
      product.productSize.length > 0 &&
      !selectedSize
    ) {
      showError("Please select a size");
      return;
    }

    if (
      product.productColor &&
      product.productColor.length > 0 &&
      !selectedColor
    ) {
      showError("Please select a color");
      return;
    }

    if (product.productRam && product.productRam.length > 0 && !selectedRam) {
      showError("Please select a RAM");
      return;
    }

    if (
      product.productWeight &&
      product.productWeight.length > 0 &&
      !selectedWeight
    ) {
      showError("Please select a Weight");
      return;
    }

    const payload = {
      ...product,
    };

    if (product.productSize && product.productSize.length > 0) {
      payload.selectedProductSize = selectedSize;
    }
    if (product.productColor && product.productColor.length > 0) {
      payload.selectedProductColor = selectedColor;
    }
    if (product.productRam && product.productRam.length > 0) {
      payload.selectedProductRam = selectedRam;
    }
    if (product.productWeight && product.productWeight.length > 0) {
      payload.selectedProductWeight = selectedWeight;
    }

    dispatch(cartActions?.addToCart(payload));
  }, [
    dispatch,
    cartActions,
    product,
    selectedSize,
    selectedColor,
    selectedRam,
    selectedWeight,
    showError,
  ]);

  //  set the items value if they were already changed from cart page
  useEffect(() => {
    setSelectedColor(findedItem?.selectedProductColor || "");
    setSelectedRam(findedItem?.selectedProductRam || "");
    setSelectedWeight(findedItem?.selectedProductWeight || "");
    setSelectedSize(findedItem?.selectedProductSize || "");
  }, [findedItem]);

  return (
    <>
      <h1 className="mb-2 ">{product?.name || "No Product Name"}</h1>
      <div className="flex tablet:items-center items-start flex-col tablet:flex-row gap-3 justify-start ">
        <span className="text-[#666] text-sm">
          Brands:{" "}
          <span className="text-black font-medium">
            {product?.brand || "No Product Brand"}
          </span>
        </span>
        <Rating
          name="read-only"
          value={product?.rating || 0}
          readOnly
          precision={0.1}
          size="small"
        />
        <span
          className="text-sm cursor-pointer text-[#666] "
          onClick={goToReviews}
        >
          Review ({noOfReviews})
        </span>
      </div>
      <div className="flex tablet:items-center flex-col tablet:flex-row items-start gap-4 mt-4 ">
        <div className="flex items-center gap-4">
          <span className="line-through text-gray-500">
            {product?.oldPrice} <span className="">PKR</span>
          </span>
          <span className="text-[#FF5252] font-medium ml-2">
            {product?.price} <span className="text-[#FF5252]">PKR</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#666]">
            Available in stock:{" "}
            <span className="text-green-600 text-sm font-semibold">
              {product?.stock} Items
            </span>
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm mt-3 pr-10 mb-5">
          {product?.description || "No Product Description"}
        </p>
      </div>

      {/* Size Selection */}
      {product.productSize && product.productSize.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-base">Size:</span>
          <div className="flex items-center gap-1 actions">
            {product.productSize.map((size, index) => (
              <Button
                key={index}
                className={`${
                  selectedSize === size ? "!bg-primary !text-white" : ""
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {product.productColor && product.productColor.length > 0 && (
        <div className="flex items-center gap-3 mt-4">
          <span className="text-base">Color:</span>
          <div className="flex items-center gap-1 actions">
            {product.productColor.map((color, index) => (
              <Button
                key={index}
                className={`${
                  selectedColor === color ? "!bg-primary !text-white" : ""
                }`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* RAM Selection */}
      {product.productRam && product.productRam.length > 0 && (
        <div className="flex items-center gap-3 mt-4">
          <span className="text-base">RAM:</span>
          <div className="flex items-center gap-1 actions">
            {product.productRam.map((ram, index) => (
              <Button
                key={index}
                className={`${
                  selectedRam === ram ? "!bg-primary !text-white" : ""
                }`}
                onClick={() => setSelectedRam(ram)}
              >
                {ram}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Weight Selection */}

      {product.productWeight && product.productWeight.length > 0 && (
        <div className="flex items-center gap-3 mt-4">
          <span className="text-base">Weight:</span>
          <div className="flex items-center gap-1 actions">
            {product.productWeight.map((weight, index) => (
              <Button
                key={index}
                className={`${
                  selectedWeight === weight ? "!bg-primary !text-white" : ""
                }`}
                onClick={() => setSelectedWeight(weight)}
              >
                {weight}
              </Button>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm mt-4 mb-2">Free Shipping (Est. 7-10 days)</p>
      <div className="flex items-center gap-4">
        <div className="qtyboxwrapper w-[4.4rem]">
          <QuantityBox product={product} />
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={product?.stock === 0}
          className=" !bg-primary hover:!bg-black flex gap-2 !text-white"
        >
          <MdOutlineShoppingCart className=" text-xl text-white" />
          {product?.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
      <div className="flex items-center gap-4 mt-6">
        <span
          onClick={() => dispatch(wishlistActions.addTowishlist(product))}
          className="flex items-center gap-3 tablet:text-sm text-xs mt-2 link cursor-pointer font-medium"
        >
          <FaRegHeart />
          Add to Wishlist
        </span>
      </div>
    </>
  );
};

export default memo(ProductRightSideContent);

import React, { memo, useCallback, useState } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import useReduxHooks from "../../hooks/useReduxHooks";
import useProvideHooks from "../../hooks/useProvideHooks";
import { Button } from "@mui/material";

const CartLeftSide = () => {
  const { cart, cartActions, dispatch } = useReduxHooks();
  const { showSuccess, showError } = useProvideHooks();

  const cartItems = cart?.cart || [];

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);

  const handleRemoveCart = useCallback(
    (id) => {
      dispatch(cartActions.removeFromCart(id));
    },
    [dispatch, cartActions]
  );

  const handleSizeClose = (size, productId) => {
    setSelectedSize(size);
    dispatch(cartActions.updateProductSize({ id: productId, size }));
  };

  const handleColorClose = (color, productId) => {
    setSelectedColor(color);
    dispatch(cartActions.updateProductColor({ id: productId, color }));
  };

  const handleRamClose = (ram, productId) => {
    setSelectedRam(ram);
    dispatch(cartActions.updateProductRam({ id: productId, ram }));
  };

  const handleWeightClose = (weight, productId) => {
    setSelectedWeight(weight);
    dispatch(cartActions.updateProductWeight({ id: productId, weight }));
  };

  const handleQtyClose = (qty, itemId, stock) => {
    if (qty > stock) {
      showError("Quantity is greater than the remaning stock");
      return;
    }

    setSelectedQty(qty);
    dispatch(cartActions.updateQuantity({ id: itemId, quantity: qty }));
  };

  return (
    <div className="left w-full laptop:w-[75%]">
      <h2>Your Cart</h2>
      <p className="mt-0">
        There are{" "}
        <span className="text-sm text-primary font-semibold">
          {cartItems.length}{" "}
        </span>{" "}
        items in your cart.
      </p>
      <div className="flex items-end justify-end mb-4 ">
        <Button
          onClick={() => {
            dispatch(cartActions.clearCart());
            showSuccess("Cart Cleared");
          }}
          sx={{
            backgroundColor: "#FF5252",
            color: "#fff",
            fontWeight: "600",
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#FF4040",
            },
          }}
        >
          Clear Cart
        </Button>
      </div>

      <div className="card shadow-md rounded-md bg-white">
        {cartItems?.length !== 0 ? (
          cartItems?.map((item) => (
            <div
              key={item?._id}
              className="cartitem w-full p-3 flex items-center gap-4 pb-4 border-b border-[rgba(0,0,0,0.1)]"
            >
              <div className="img laptop:w-[15%] w-[30%] rounded-md overflow-hidden">
                <Link to={`/product/${item?._id}`}>
                  <img
                    src={
                      item.images && item.images[0]?.url
                        ? item.images[0].url
                        : "/default-image.jpg"
                    }
                    alt={item.name}
                    className="w-full group-hover:scale-105 transition-all"
                  />
                </Link>
              </div>
              <div className="info laptop:w-[85%] w-[70%] relative">
                <IoCloseSharp
                  onClick={() => handleRemoveCart(item._id)}
                  className="link absolute right-2 text-base transition-all top-2 cursor-pointer"
                />
                <span className="text-sm">{item.brand}</span>
                <h3 className="tablet:text-base text-xs font-semibold">
                  <Link to={`/product/${item?._id}`} className="link">
                    {item?.name && item?.name.length > 60 ? (
                      <>{item?.name.slice(0, 60)}...</>
                    ) : (
                      item?.name
                    )}
                  </Link>
                </h3>
                <Rating
                  name="read-only"
                  value={item.rating || 0}
                  size="small"
                  readOnly
                />
                <div className="menu flex items-center gap-4 mt-2">
                  {item.productSize && item.productSize.length > 0 && (
                    <div className="relative">
                      <Select
                        className="text-sm tablet:text-base font-medium"
                        classNamePrefix="select"
                        isSearchable={true}
                        name="size"
                        defaultValue={{
                          value: item.selectedProductSize || selectedSize,
                          label: item.selectedProductSize || selectedSize,
                        }}
                        options={
                          item?.productSize?.map((size) => ({
                            value: size,
                            label: size,
                          })) || []
                        }
                        placeholder="Select Size"
                        onChange={(e) => {
                          handleSizeClose(e.value, item._id);
                        }}
                      />
                    </div>
                  )}
                  {item.productColor && item.productColor.length > 0 && (
                    <div className="relative">
                      <Select
                        className="text-sm tablet:text-base font-medium"
                        classNamePrefix="select"
                        isSearchable={true}
                        name="color"
                        defaultValue={{
                          value: item.selectedProductColor || selectedColor,
                          label: item.selectedProductColor || selectedColor,
                        }}
                        options={
                          item?.productColor?.map((color) => ({
                            value: color,
                            label: color,
                          })) || []
                        }
                        placeholder="Select Color"
                        onChange={(e) => {
                          handleColorClose(e.value, item._id);
                        }}
                      />
                    </div>
                  )}
                  {item.productRam && item.productRam.length > 0 && (
                    <div className="relative">
                      <Select
                        className="text-sm tablet:text-base font-medium"
                        classNamePrefix="select"
                        isSearchable={true}
                        name="ram"
                        defaultValue={{
                          value: item.selectedProductRam || selectedRam,
                          label: item.selectedProductRam || selectedRam,
                        }}
                        options={
                          item?.productRam?.map((ram) => ({
                            value: ram,
                            label: ram,
                          })) || []
                        }
                        placeholder="Select Ram"
                        onChange={(e) => {
                          handleRamClose(e.value, item._id);
                        }}
                      />
                    </div>
                  )}
                  {item.productWeight && item.productWeight.length > 0 && (
                    <div className="relative">
                      <Select
                        className="text-sm tablet:text-base font-medium"
                        classNamePrefix="select"
                        isSearchable={true}
                        name="weight"
                        defaultValue={{
                          value: item.selectedProductWeight || selectedWeight,
                          label: item.selectedProductWeight || selectedWeight,
                        }}
                        options={
                          item?.productWeight?.map((weight) => ({
                            value: weight,
                            label: weight,
                          })) || []
                        }
                        placeholder="Select Weight"
                        onChange={(e) => {
                          handleWeightClose(e.value, item._id);
                        }}
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Select
                      className="text-sm tablet:text-base font-medium"
                      classNamePrefix="select"
                      isSearchable={true}
                      defaultValue={{
                        value: item.quantity || selectedQty,
                        label: item.quantity || selectedQty,
                      }}
                      name="color"
                      options={
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((qty) => ({
                          value: qty,
                          label: qty,
                        })) || []
                      }
                      placeholder="Select Quantity"
                      onChange={(e) => {
                        handleQtyClose(e.value, item._id, item?.stock);
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="line-through text-gray-500 text-sm">
                    {item.oldPrice} <span className="text-sm">PKR</span>
                  </span>
                  <span className="text-gray-500 font-medium ml-2 text-sm">
                    {item.price}{" "}
                    <span className="text-sm text-gray-500">PKR</span>
                  </span>
                  <span className="text-[#FF5252] font-medium ml-2 text-sm">
                    {item.discount}%{" "}
                    <span className="text-sm text-[#FF5252]">OFF</span>
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="cartitem w-full p-3 flex items-center gap-4 pb-4 border-b border-[rgba(0,0,0,0.1)]">
            <p>No items in cart</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CartLeftSide);

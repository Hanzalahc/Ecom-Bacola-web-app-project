import React, { memo, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import useReduxHooks from "../../../hooks/useReduxHooks";

const AddToCartDrawer = ({ setIsDrawerOpen, isDrawerOpen }) => {
  const { cart, cartActions, dispatch } = useReduxHooks();

  const cartItems = cart.cart;

  const toggleDrawer = (newOpen) => {
    setIsDrawerOpen(newOpen);
  };

  const handleRemoveCart = useCallback(
    (id) => {
      dispatch(cartActions.removeFromCart(id));
    },
    [dispatch, cartActions]
  );

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const DrawerList = (
    <Box sx={{ width: 400 }} role="presentation">
      <div className="flex items-center justify-between py-3 px-4 gap-3 border-b brder-[rgba(0,0,0,0.1)]">
        <h4 className="text-secondary text-base">
          Shopping Cart ({cartItems.length || 0}){" "}
        </h4>
        <IoCloseSharp
          className="cursor-pointer text-lg"
          onClick={() => toggleDrawer(false)}
        />
      </div>
      <div className="scroll w-full max-h-72 overflow-y-scroll overflow-x-hidden py-3 px-4">
        {cartItems.length !== 0 ? (
          cartItems.map((item) => (
            <div
              key={item._id}
              className="cartitem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4 "
            >
              <div className="img w-[25%] overflow-hidden rounded-md h-20 ">
                <Link className="group">
                  <img
                    src={
                      item.images && item.images[0].url
                        ? item.images[0].url
                        : "/default-image.jpg"
                    }
                    alt={item.name}
                    className="w-full group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="info w-[75%] pr-5 relative">
                <Link
                  className="link transition-all text-sm"
                  to={`/product/${item._id}`}
                >
                  <h4 className="tablet:text-sm text-xs font-medium link">
                    {item.name && item.name.substring(0, 30)}...
                  </h4>
                </Link>
                <p className="flex items-center gap-5 mt-2 mb-2">
                  <span className="text-xs tablet:text-sm">
                    Qty :<span>{item.quantity}</span>
                  </span>
                  <span className="text-primary font-semibold">
                    <span>{item.price * item.quantity}</span>
                  </span>
                </p>
                <MdOutlineDeleteOutline
                  onClick={() => handleRemoveCart(item._id)}
                  className="text-lg link absolute top-4 right-0 transition-all cursor-pointer"
                ></MdOutlineDeleteOutline>
              </div>
            </div>
          ))
        ) : (
          <p>No items in cart</p>
        )}
      </div>
      <div className="bottominfo w-full border-t border-[rgba(0,0,0,0.1)] py-3 px-4 flex items-center justify-between flex-col">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-semibold">
            {cartItems.length === 1 ? "1 Item" : `${cartItems.length} Items`}
          </span>
          <span className="text-primary text-sm font-semibold">
            Pkr {totalPrice}
          </span>{" "}
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-semibold">Shipping</span>
          <span className="text-primary text-sm font-semibold">Free</span>
        </div>
      </div>
      <div className="bottominfo w-full border-t border-[rgba(0,0,0,0.1)] py-3 px-4 flex items-center justify-between flex-col">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-semibold">Total (tax excl.)</span>
          <span className="text-primary text-sm font-semibold">
            Pkr {totalPrice}
          </span>{" "}
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-semibold">Total (tax incl.) </span>
          <span className="text-primary text-sm font-semibold">Free</span>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-semibold">Taxes</span>
          <span className="text-primary text-sm font-semibold">Free</span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.1)] py-3 px-4 gap-5">
        <Button
          className=" !bg-primary hover:!bg-black w-[50%] flex gap-2 !text-white"
          onClick={() => toggleDrawer(false)}
        >
          <Link
            to="/cart"
            className="w-full h-full flex items-center justify-center"
          >
            View Cart
          </Link>
        </Button>
        <Button
          className=" !bg-primary hover:!bg-black w-[50%] flex gap-2 !text-white"
          onClick={() => toggleDrawer(false)}
        >
          <Link
            to="/checkout"
            className="w-full h-full flex items-center justify-center"
          >
            Checkout
          </Link>
        </Button>
      </div>
    </Box>
  );
  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={() => toggleDrawer(false)}
    >
      {DrawerList}
    </Drawer>
  );
};

export default memo(AddToCartDrawer);

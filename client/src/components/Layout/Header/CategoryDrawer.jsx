import React, { memo } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IoCloseSharp } from "react-icons/io5";
import { CategoryDrawerOptions } from "../../";

const CategoryDrawer = ({ setIsDrawerOpen, isDrawerOpen }) => {
  const toggleDrawer = (newOpen) => () => {
    setIsDrawerOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <h3 className="p-3 text-secondary text-base tablet:text-lg laptop:text-xl font-semibold flex items-center justify-between">
        Shop by categories{" "}
        <IoCloseSharp
          className="cursor-pointer text-lg"
          onClick={toggleDrawer(false)}
        ></IoCloseSharp>
      </h3>
      <CategoryDrawerOptions />
    </Box>
  );
  return (
    <>
      <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
};

export default memo(CategoryDrawer);

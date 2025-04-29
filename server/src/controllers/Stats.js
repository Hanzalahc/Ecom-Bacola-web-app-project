import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";

export const getStats = asyncHandler(async (req, res, next) => {
  try {
    const userCount = await User.countDocuments({ role: { $ne: "admin" } });
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    const pendingOrderCount = await Order.countDocuments({
      orderStatus: "pending",
    });

    const totalSalesAmountResult = await Order.aggregate([
      {
        $match: { paymentStatus: "completed", orderStatus: "delivered" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalSalesCountResult = await Order.aggregate([
      {
        $match: { paymentStatus: "completed", orderStatus: "delivered" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);

    // Extract values safely or default to 0
    const totalSalesAmount =
      totalSalesAmountResult.length > 0 ? totalSalesAmountResult[0].total : 0;
    const totalSalesCount =
      totalSalesCountResult.length > 0 ? totalSalesCountResult[0].total : 0;

    const monthlySales = await Order.aggregate([
      {
        $match: { paymentStatus: "completed", orderStatus: "delivered" },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalUsers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const chartData = months.map((month, index) => {
      const sales = monthlySales.find((s) => s._id === index + 1);
      const users = monthlyUsers.find((u) => u._id === index + 1);

      return {
        name: month,
        totalSales: sales ? sales.totalSales : 0,
        totalUsers: users ? users.totalUsers : 0,
      };
    });

    res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      data: {
        userCount,
        productCount,
        categoryCount,
        pendingOrderCount,
        totalSalesAmount,
        totalSalesCount,
        chartData,
      },
    });
  } catch (error) {
    next(new apiError(500, "Error fetching stats"));
  }
});

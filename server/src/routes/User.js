import express from "express";
const router = express.Router();
import {
  isAuthenticated,
  isPassTokenAuthenticated,
} from "../middlewares/isAuth.js";
import { multerFileUpload } from "../middlewares/multerFile.js";
import {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateUserAvatar,
  updateUserDetails,
  forgetUserPassword,
  verifyUserPasswordResetToken,
  changeCurrentPassword,
  loginAndRegisterWithGoogle,
  getAllUsers,
  filters,
  EditUserStatusByAdmin,
} from "../controllers/User.js";
import rateLimit from "express-rate-limit";

// const verifyEmailLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 5 requests per windowMs
//   message: "Too many email verification attempts, please try again later",
// });

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 5 requests per windowMs
//   message: "Too many login attempts, please try again later",
// });

// const registerLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 3, // Limit each IP to 3 requests per windowMs
//   message:
//     "Too many accounts created from this IP, please try again after an hour",
// });

// const updateUserAvatarLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 5, // Limit each IP to 5 requests per windowMs
//   message: "Too many avatar update requests, please try again later",
// });

// const updateUserDetailsLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 5, // Limit each IP to 5 requests per windowMs
//   message: "Too many details update requests, please try again later",
// });

// const forgetUserPasswordLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 5, // Limit each IP to 5 requests per windowMs
//   message: "Too many password reset requests, please try again later",
// });

router.post(
  "/register",
  //  registerLimiter,
  registerUser
);
router.get(
  "/verify-email/:token",
  // verifyEmailLimiter,
  verifyEmail
);
router.patch(
  "/login",
  //  loginLimiter,
  loginUser
);
router.get("/logout", isAuthenticated, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/current-user", isAuthenticated, getCurrentUser);
router.patch(
  "/update-avatar",
  // updateUserAvatarLimiter,
  multerFileUpload.single("avatar"),
  isAuthenticated,
  updateUserAvatar
);
router.patch(
  "/update-details",
  // updateUserDetailsLimiter,
  isAuthenticated,
  updateUserDetails
);
router.patch(
  "/forget-password",
  //  forgetUserPasswordLimiter,
  forgetUserPassword
);
router.get(
  "/verify-password-reset-token/:token",
  isPassTokenAuthenticated,
  verifyUserPasswordResetToken
);
router.patch(
  "/change-password",
  isPassTokenAuthenticated,
  changeCurrentPassword
);
router.post("/google-login", loginAndRegisterWithGoogle);
router.get("/all", isAuthenticated, getAllUsers);
router.get("/filters", isAuthenticated, filters);
router.patch("/edit-status", isAuthenticated, EditUserStatusByAdmin);

export default router;

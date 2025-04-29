import { lazy } from "react";

// Eagerly loaded critical pages
import Home from "./Home/Home";
import Pagenotfound from "./Pagenotfound";

// Lazily loaded non-critical pages
const Login = lazy(() => import("./Auth/Login"));
const Register = lazy(() => import("./Auth/Register"));
const VerifyEmailLink = lazy(() => import("./Auth/VerifyEmailLink"));
const ForgetPass = lazy(() => import("./Auth/ForgetPass"));
const VerifyPassLink = lazy(() => import("./Auth/VerifyPassLink"));
const ResetPassword = lazy(() => import("./Auth/ResetPassword"));
import ProductListing from "./Product/ProductListing";
import ProductDetails from "./Product/ProductDetails";
import Cart from "./Cart/Cart";
import Checkout from "./Checkout/Checkout";
import MyAccount from "./Profile/MyAccount";
import MyWishlistPage from "./Profile/MyWishlistPage";
import MyOrdersPage from "./Profile/MyOrdersPage";
import MyAddressPage from "./Profile/MyAddressPage";
const OrderSuccess = lazy(() => import("./Order/OrderSuccess"));
const OrderFailed = lazy(() => import("./Order/OrderFailed"));
const SearchResults = lazy(() => import("./SearchPage/SearchResults"));

export {
  Home,
  Login,
  Register,
  VerifyEmailLink,
  ForgetPass,
  VerifyPassLink,
  ResetPassword,
  Pagenotfound,
  ProductListing,
  ProductDetails,
  Cart,
  Checkout,
  MyAccount,
  MyWishlistPage,
  MyOrdersPage,
  MyAddressPage,
  OrderSuccess,
  OrderFailed,
  SearchResults,
};

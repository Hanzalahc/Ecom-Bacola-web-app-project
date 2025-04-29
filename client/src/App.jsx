import React, { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/index.js";
import Layout from "./Layout.jsx";
import AdminLayout from "./AdminLayout.jsx";

// Import pages
import {
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
} from "./pages";

// Import components
import { Loader, UserProtectedRoute } from "./components";

// Import admin  pages
import {
  AdminHome,
  AdminLogin,
  AdminProductListing,
  AdminProductAdd,
  AdminCategoryList,
  AdminCategoryAdd,
  AdminSubCategoryList,
  AdminSubCategoryAdd,
  AdminUsersList,
  AdminOrdersList,
  AdminProductEditPage,
} from "./pages/Admin";

// Import admin components
import { AdminProtectedRoute } from "./components/Admin";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/verify-email-link/:token", element: <VerifyEmailLink /> },
        { path: "/forget-password", element: <ForgetPass /> },
        { path: "/verify-password-link/:token", element: <VerifyPassLink /> },
        { path: "/reset-password", element: <ResetPassword /> },
        { path: "/product-listing/:categoryId", element: <ProductListing /> },
        { path: "/product/:productId", element: <ProductDetails /> },
        { path: "/cart", element: <Cart /> },
        { path: "/my-wishlist", element: <MyWishlistPage /> },
        {
          path: "/search-results",
          element: <SearchResults />,
        },
        {
          element: <UserProtectedRoute />,
          children: [
            { path: "/checkout", element: <Checkout /> },
            { path: "/my-profile", element: <MyAccount /> },
            { path: "/my-orders", element: <MyOrdersPage /> },
            {
              path: "/my-address",
              element: <MyAddressPage />,
            },
            {
              path: "/order-success",
              element: <OrderSuccess />,
            },
            {
              path: "/order-failed",
              element: <OrderFailed />,
            },
          ],
        },

        { path: "*", element: <Pagenotfound /> },
      ],
    },

    // admin routes
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { path: "login", element: <AdminLogin /> },

        {
          element: <AdminProtectedRoute />,
          children: [
            { path: "", element: <AdminHome /> },
            { path: "product-listing", element: <AdminProductListing /> },
            { path: "product-add", element: <AdminProductAdd /> },
            { path: "category-list", element: <AdminCategoryList /> },
            { path: "category-add", element: <AdminCategoryAdd /> },
            { path: "sub-category-list", element: <AdminSubCategoryList /> },
            { path: "sub-category-add", element: <AdminSubCategoryAdd /> },
            { path: "users-list", element: <AdminUsersList /> },
            { path: "orders-list", element: <AdminOrdersList /> },
            {
              path: "product-edit/:productId",
              element: <AdminProductEditPage />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster />
      </PersistGate>
    </Provider>
  );
}

export default App;

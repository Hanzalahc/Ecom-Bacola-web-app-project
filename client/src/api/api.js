const apis = () => {
  const local = "http://localhost:8000/";

  const list = {
    // Image
    image: {
      url: `${local}gallery/upload`,
      method: "POST",
    },

    // User
    userRegister: {
      url: `${local}user/register`,
      method: "POST",
    },
    userVerifyEmail: {
      url: `${local}user/verify-email/`,
      method: "GET",
    },
    userLogin: {
      url: `${local}user/login`,
      method: "PATCH",
    },
    userLogout: {
      url: `${local}user/logout`,
      method: "GET",
    },
    currentUser: {
      url: `${local}user/current-user`,
      method: "GET",
    },
    userForgetPassword: {
      url: `${local}user/forget-password`,
      method: "PATCH",
    },
    userVerifyPassLink: {
      url: `${local}user/verify-password-reset-token/`,
      method: "GET",
    },
    userResetPassword: {
      url: `${local}user/change-password`,
      method: "PATCH",
    },
    userUpdateDetails: {
      url: `${local}user/update-details`,
      method: "PATCH",
    },
    userUpdateAvatar: {
      url: `${local}user/update-avatar`,
      method: "PATCH",
    },
    userGoogleMethod: {
      url: `${local}user/google-login`,
      method: "POST",
    },
    refreshAccressToken: {
      url: `${local}user/refresh-token`,
      method: "POST",
    },
    getAllUsers: {
      url: `${local}user/all`,
      method: "GET",
    },
    getUsersByFilters: {
      url: `${local}user/filters`,
      method: "GET",
    },
    updateUserStatus: {
      url: `${local}user/edit-status`,
      method: "PATCH",
    },

    // Address
    addAddress: {
      url: `${local}address/add`,
      method: "POST",
    },
    getUserAllAddress: {
      url: `${local}address/all`,
      method: "GET",
    },
    deleteAddress: {
      url: `${local}address/delete`,
      method: "DELETE",
    },

    // Category
    addCategory: {
      url: `${local}category/create-new`,
      method: "POST",
    },
    getAllCategories: {
      url: `${local}category/get-all`,
      method: "GET",
    },
    deleteCategory: {
      url: `${local}category/delete-category`,
      method: "DELETE",
    },
    getSingleCategory: {
      url: `${local}category/get-single`,
      method: "GET",
    },
    updateCategory: {
      url: `${local}category/update-category`,
      method: "PATCH",
    },
    addSubCategory: {
      url: `${local}category/create-sub-category`,
      method: "PATCH",
    },
    deleteSubCategory: {
      url: `${local}category/delete-sub-createCategory`,
      method: "DELETE",
    },
    updateSubCategory: {
      url: `${local}category/update-sub-category`,
      method: "PATCH",
    },

    //  Product
    addProduct: {
      url: `${local}product/create`,
      method: "POST",
    },
    getAllProducts: {
      url: `${local}product/get-all`,
      method: "GET",
    },
    deleteProduct: {
      url: `${local}product/delete`,
      method: "DELETE",
    },
    deleteMultipleProducts: {
      url: `${local}product/delete-multiple`,
      method: "DELETE",
    },
    getSingleProduct: {
      url: `${local}product/get-single/`,
      method: "GET",
    },
    updateProduct: {
      url: `${local}product/update/`,
      method: "PUT",
    },
    getProductsByCategory: {
      url: `${local}product/get-by-category/`,
      method: "GET",
    },
    getProductsBySubCategory: {
      url: `${local}product/get-by-sub-category/`,
      method: "GET",
    },
    getProductsByStatus: {
      url: `${local}product/get-by-status/`,
      method: "GET",
    },
    getProductsByFilters: {
      url: `${local}product/filters`,
      method: "POST",
    },
    getProductsBySearch: {
      url: `${local}product/search`,
      method: "GET",
    },

    // Review
    addReview: {
      url: `${local}review/add/`,
      method: "POST",
    },
    getUserReviews: {
      url: `${local}review/user`,
      method: "GET",
    },

    // order
    addOrder: {
      url: `${local}order/add`,
      method: "POST",
    },
    getUserOrders: {
      url: `${local}order/user`,
      method: "GET",
    },
    getAllOrders: {
      url: `${local}order/all`,
      method: "GET",
    },
    orderFilters: {
      url: `${local}order/filters`,
      method: "GET",
    },
    updateOrderStatus: {
      url: `${local}order/update-status`,
      method: "PATCH",
    },

    // stripe
    stripePayment: {
      url: `${local}stripe/pay`,
      method: "POST",
    },
    verifyPayment: {
      url: `${local}stripe/verify-payment`,
      method: "POST",
    },

    // admin stats
    getStats: {
      url: `${local}stats/data`,
      method: "GET",
    },
  };

  return list;
};

export default apis;

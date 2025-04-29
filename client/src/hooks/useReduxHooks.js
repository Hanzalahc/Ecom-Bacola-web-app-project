import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { sidebarActions } from "./../store/sidebar-slice";
import { adminActions } from "../store/admin-slice";
import { protectedActions } from "../store/protected-slice";
import { productActions } from "../store/product-slice";
import { categoryActions } from "../store/category-slice";
import { cartActions } from "../store/cart-slice";
import { wishlistActions } from "../store/wishlist-slice";
import { adminStatsActions } from "../store/adminStats-slice";

const useReduxHooks = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const sidebar = useSelector((state) => state.sidebar);
  const admin = useSelector((state) => state.admin);
  const protectedPage = useSelector((state) => state.protected);
  const products = useSelector((state) => state.product);
  const categories = useSelector((state) => state.category);
  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist);
  const adminStats = useSelector((state) => state.adminStats);

  return {
    dispatch,
    auth,
    authActions,
    sidebar,
    sidebarActions,
    admin,
    adminActions,
    protectedPage,
    protectedActions,
    products,
    productActions,
    categories,
    categoryActions,
    cart,
    cartActions,
    wishlist,
    wishlistActions,
    adminStats,
    adminStatsActions,
  };
};

export default useReduxHooks;

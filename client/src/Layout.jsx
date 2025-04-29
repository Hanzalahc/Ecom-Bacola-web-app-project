import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer, Loader } from "./components";
import useApiSubmit from "./hooks/useApiSubmit";
import useReduxHooks from "./hooks/useReduxHooks";
import useProvideHooks from "./hooks/useProvideHooks";
import { useEffect } from "react";

const Layout = () => {
  const location = useLocation();
  const { apis } = useProvideHooks();
  const { authActions, auth, dispatch } = useReduxHooks();
  const { apiSubmit, loading } = useApiSubmit();

  const currentUserRefreshToken = auth.userData?.refreshToken || false;

  // Regex patterns for pages where header, footer should be hidden
  const hideHeaderFooterRegex = [
    /^\/login$/,
    /^\/register$/,
    /^\/verify-email-link\/[^/]+$/,
    /^\/forget-password$/,
    /^\/verify-password-link\/[^/]+$/,
    /^\/reset-password$/,
    /^\/order-success$/,
    /^\/order-failed$/,
  ];

  const shouldHideHeaderFooter = hideHeaderFooterRegex.some((regex) =>
    regex.test(location.pathname)
  );

  const refreshAccressToken = async () => {
    const response = await apiSubmit({
      url: apis().refreshAccressToken.url,
      method: apis().refreshAccressToken.method,
      values: {
        refreshToken: currentUserRefreshToken,
      },
      successMessage: null,
      showLoadingToast: true,
    });

    if (!response?.success) {
      handleLogout();
      dispatch(authActions?.logout());
    }
  };

  const handleLogout = async () => {
    await apiSubmit({
      url: apis().userLogout.url,
      method: apis().userLogout.method,
      showLoadingToast: true,
      successMessage: null,
    });
  };

  // initial fetch
  useEffect(() => {
    const controller = new AbortController();

    if (currentUserRefreshToken) {
      refreshAccressToken();
    }

    return () => controller.abort();
  }, []);

  if (loading && !auth?.status) {
    return <Loader />;
  }

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <main>
        <Outlet />
      </main>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
};

export default Layout;

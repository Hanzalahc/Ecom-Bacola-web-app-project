import React, { memo } from "react";

import { Outlet } from "react-router-dom";
import useProvideHooks from "../hooks/useProvideHooks";
import useReduxHooks from "../hooks/useReduxHooks";

const UserProtectedRoute = () => {
  const { navigate, useEffect } = useProvideHooks();
  const { auth } = useReduxHooks();

  const UserAuthorized = auth?.status;

  useEffect(() => {
    if (!UserAuthorized) navigate("/login");
    return;
  }, []);

  return UserAuthorized && <Outlet />;
};

export default memo(UserProtectedRoute);

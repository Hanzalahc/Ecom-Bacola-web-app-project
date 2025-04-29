import React, { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { Button } from "@mui/material";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import useReduxHooks from "../../hooks/useReduxHooks";

const ResetPassword = () => {
  const { apis, navigate, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { dispatch, protectedActions, protectedPage } = useReduxHooks();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const resetPassPageAccess = protectedPage?.resetPassPageAccess || false;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!resetPassPageAccess) {
      showError("Unauthorized Request!");
      navigate("/");
      return;
    }
  }, []);

  const handleResetPass = async (data) => {
    const resetPassResponce = await apiSubmit({
      url: apis().userResetPassword.url,
      method: apis().userResetPassword.method,
      values: data,
      showLoadingToast: true,
      loadingMessage: "Resetting password..., Please wait!",
    });

    if (resetPassResponce?.success) {
      dispatch(protectedActions.setResetPassPageAccess(false));
      navigate("/sigin");
    }
  };

  return (
    <section className="section py-4 laptop:py-10">
      <div className="w-[95%] mx-auto">
        <div className="card shadow-md m-auto w-full laptop:w-[31rem] rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-lg text-black">
            Reset Your Password
          </h3>
          <form
            className="w-full mt-5"
            onSubmit={handleSubmit(handleResetPass)}
          >
            <div className="form-group w-full mb-5 relative">
              <TextField
                type={showPassword ? "text" : "password"}
                id="password"
                label="New Password *"
                variant="outlined"
                className="w-full"
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password must contain at least one uppercase letter",
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) ||
                      "Password must contain at least one lowercase letter",
                    hasSpecialChar: (value) =>
                      /[\W_]/.test(value) ||
                      "Password must contain at least one special character",
                  },
                })}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
              <Button
                className="!absolute top-2 right-2 !z-50 !w-9 !h-9 !min-w-9 !rounded-full !text-black opacity-75"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoMdEye className="text-xl" />
                ) : (
                  <IoIosEyeOff className="text-xl" />
                )}
              </Button>
            </div>

            <div className="form-group w-full mb-5 relative">
              <TextField
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                label="Confirm Password *"
                variant="outlined"
                className="w-full"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
              <Button
                className="!absolute top-2 right-2 !z-50 !w-9 !h-9 !min-w-9 !rounded-full !text-black opacity-75"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <IoMdEye className="text-xl" />
                ) : (
                  <IoIosEyeOff className="text-xl" />
                )}
              </Button>
            </div>

            <div className="flex items-center w-full mt-3">
              <Button
                type="submit"
                disabled={loading}
                className="btn-org w-full"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default memo(ResetPassword);

import React, { memo } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import useProvideHooks from "../../hooks/useProvideHooks";
import useReduxHooks from "../../hooks/useReduxHooks";
import useApiSubmit from "../../hooks/useApiSubmit";

const ForgetPass = () => {
  const { apis, Link } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { dispatch, protectedActions } = useReduxHooks();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleResetPass = async (data) => {
    const resetPassResponce = await apiSubmit({
      url: apis().userForgetPassword.url,
      method: apis().userForgetPassword.method,
      values: data,
      showLoadingToast: true,
      loadingMessage: "Sending reset link..., Please wait!",
    });

    if (resetPassResponce.success) {
      dispatch(protectedActions.setResetPassPageAccess(true));
    }
  };
  return (
    <section className="section py-4 laptop:py-10">
      <div className="w-[95%] mx-auto">
        <div className="card shadow-md m-auto w-full laptop:w-[31rem] rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-lg text-black">
            Reset Your Password
          </h3>
          <p className="text-center text-sm text-gray-500 mt-2">
            Enter your email address, and we'll send you a link to reset your
            password.
          </p>

          <form
            className="w-full mt-5"
            onSubmit={handleSubmit(handleResetPass)}
          >
            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                id="email"
                label="Email *"
                variant="outlined"
                className="w-full"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex items-center w-full mt-3">
              <Button
                type="submit"
                disabled={loading}
                className="btn-org w-full"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>

            <div className="flex items-center w-full mt-3">
              <p className="text-center text-sm">
                Remember your password?{" "}
                <Link
                  className="link cursor-pointer text-sm font-medium"
                  to="/login"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default memo(ForgetPass);

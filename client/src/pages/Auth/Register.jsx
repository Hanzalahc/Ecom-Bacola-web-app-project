import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { Button } from "@mui/material";
import { CgLogIn } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";
import useProvideHooks from "./../../hooks/useProvideHooks";
import useApiSubmit from "./../../hooks/useApiSubmit";
import useReduxHooks from "./../../hooks/useReduxHooks";
// firebase
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "./../../firebase/firebase";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function Register() {
  const { Link, apis, showSuccess, showError, navigate } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { dispatch, protectedActions, authActions } = useReduxHooks();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (data) => {
    const formattedName = data.name.trim().replace(/\s+/g, " ");
    const formattedEmail = data.email.trim().replace(/\s+/g, "").toLowerCase();
    const formattedData = {
      name: formattedName,
      email: formattedEmail,
      password: data.password,
    };

    const registerResponce = await apiSubmit({
      url: apis().userRegister.url,
      method: apis().userRegister.method,
      values: formattedData,
      successMessage:
        "Your account has been created successfully. Now you have to verify your email address",
      showLoadingToast: true,
      loadingMessage: "Creating account..., Please wait!",
    });

    if (registerResponce.success) {
      dispatch(protectedActions.setEmailVerifyPageAccess(true));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      const user = result.user;
      const googleData = {
        name: user.displayName,
        email: user.email,
        avatar: {
          url: user.photoURL,
          publicId: null,
        },
        googleId: user.uid,
      };

      const registerResponce = await apiSubmit({
        url: apis().userGoogleMethod.url,
        method: apis().userGoogleMethod.method,
        values: googleData,
        navigateTo: "/",
        showLoadingToast: true,
        loadingMessage: "Signing in with Google..., Please wait!",
      });

      if (registerResponce.success) {
        dispatch(
          authActions.setAuth({
            ...registerResponce.data,
            method: "Google",
          })
        );
      }
    } catch (error) {
      const errorMessage = error.message;
      showError(`Failed to sign in: ${errorMessage}`);
    }
  };

  return (
    <section className="section py-4 laptop:py-10">
      <div className="w-[95%] mx-auto">
        <div className="card shadow-md m-auto w-full laptop:w-[31rem] rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-base laptop:text-lg text-black">
            Register with new account
          </h3>

          <form className="w-full mt-5" onSubmit={handleSubmit(handleSignup)}>
            <div className="form-group w-full mb-5">
              <TextField
                type="name"
                id="name"
                label="Name *"
                variant="outlined"
                className="w-full"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 30,
                    message: "Name must not exceed 30 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
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
            <div className="form-group w-full mb-5 relative">
              <TextField
                type={showPassword ? "text" : "password"}
                id="password"
                label="Password *"
                variant="outlined"
                className="w-full"
                {...register("password", {
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
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
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

            <div className="flex items-center w-full mt-3">
              <Button
                type="submit"
                disabled={loading}
                className="btn-org w-full "
              >
                {loading ? "Creating account..." : "Register"}{" "}
                <CgLogIn className="text-xl ml-2" />
              </Button>
            </div>
            <div className="flex items-center w-full mt-3 ">
              <p className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  className="link cursor-pointer text-sm font-medium"
                  to="/login"
                >
                  Login
                </Link>
              </p>
            </div>

            <p className="text-center mt-5">
              Or continue with social accounts{" "}
            </p>
            <div className="flex items-center w-full mt-3">
              <Button
                onClick={handleGoogleSignIn}
                className="!bg-[#f1f1f1] !text-secondary w-full !font-medium "
                sx={{
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <FcGoogle className="text-lg mr-2" /> Continue with Google
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default memo(Register);

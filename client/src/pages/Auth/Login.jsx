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

function Login() {
  const { Link, apis, navigate, showSuccess, showError } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { dispatch, authActions } = useReduxHooks();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (data) => {
    const formattedEmail = data.email.trim();
    const formattedData = {
      email: formattedEmail,
      password: data.password,
    };

    const loginResponce = await apiSubmit({
      url: apis().userLogin.url,
      method: apis().userLogin.method,
      values: formattedData,
      showLoadingToast: true,
      loadingMessage: "Logging in..., Please wait!",
    });

    if (loginResponce.success) {
      dispatch(authActions.setAuth(loginResponce.data));
      navigate("/");
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
        <div className="card shadow-md m-auto  w-full laptop:w-[31rem] rounded-md bg-white p-5 px-10">
          <h3 className="text-center laptop:text-lg text-base text-black">
            Login to your account
          </h3>

          <form className="w-full mt-5" onSubmit={handleSubmit(handleLogin)}>
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
            <p>
              <Link
                className="link cursor-pointer text-sm font-medium"
                to="/forget-password"
              >
                Forget Password?
              </Link>
            </p>

            <div className="flex items-center w-full mt-3">
              <Button
                type="submit"
                disabled={loading}
                className="btn-org w-full "
              >
                {loading ? "Loading..." : "Login"}{" "}
                <CgLogIn className="text-xl ml-2" />
              </Button>
            </div>
            <div className="flex items-center w-full mt-3 ">
              <p className="text-center text-sm">
                Don't have an account?{" "}
                <Link
                  className="link cursor-pointer text-sm font-medium"
                  to="/register"
                >
                  Register
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

export default memo(Login);

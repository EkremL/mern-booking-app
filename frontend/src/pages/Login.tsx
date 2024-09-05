import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.Login, {
    onSuccess: async () => {
      //   console.log("signed in!");
      showToast({ message: "Sign In Successful!", status: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      //   console.error("Error signing in:", error);
      showToast({ message: error.message, status: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label className="text-indigo-600 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal focus:border-indigo-600 focus:outline-none text-black"
          {...register("email", { required: "This field is required!" })}
          placeholder="123@example.com"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-indigo-600 text-sm font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal focus:border-indigo-600 focus:outline-none text-black"
          {...register("password", {
            required: "This field is required!",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long.",
            },
          })}
          placeholder="*****"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Not Registered?{" "}
          <Link
            className="underline text-indigo-600 font-bold"
            to={"/register"}
          >
            Create an account here
          </Link>
        </span>
        <button
          type="submit"
          className="bg-indigo-500 text-white p-2 font-bold hover:bg-indigo-400 text-xl rounded"
        >
          Login
        </button>
      </span>
    </form>
  );
};

export default Login;

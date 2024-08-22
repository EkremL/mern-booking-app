import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  //!navigate
  const navigate = useNavigate();
  //!context
  const { showToast } = useAppContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  //!react-query
  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success!", status: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, status: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    // console.log(data);
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl text-indigo-500 font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-indigo-600 text-sm font-bold flex-1">
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal focus:border-indigo-600 focus:outline-none text-black"
            {...register("firstName", { required: "This field is required!" })}
            placeholder="John"
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
          {/* buradaki mesaj, yukarda tanımladığımız "This field is required! "mesajıdır ve kullanıcıya gösterilecektir. */}
        </label>
        <label className="text-indigo-600 text-sm font-bold flex-1">
          Last Name
          <input
            className=" border rounded w-full py-1 px-2 font-normal focus:border-indigo-600 focus:outline-none text-black"
            {...register("lastName", { required: "This field is required!" })}
            placeholder="Doe"
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
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
      <label className="text-indigo-600 text-sm font-bold flex-1">
        Confirm Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal focus:border-indigo-600 focus:outline-none text-black"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) return "This field is required!";
              else if (watch("password") !== val)
                return "Your password doesn't match!";
            },
          })}
          placeholder="*****"
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span className="flex items-center justify-between">
        <span className="text-sm">
          You have already an account?{" "}
          <Link className="underline text-indigo-600 font-bold" to={"/login"}>
            Sign In
          </Link>
        </span>
        <button
          type="submit"
          className="bg-indigo-500 text-white p-2 font-bold hover:bg-indigo-400 text-xl rounded"
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;

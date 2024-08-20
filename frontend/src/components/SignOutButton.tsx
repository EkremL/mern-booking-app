import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.Logout, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Signed out!", status: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, status: "ERROR" });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className="rounded text-indigo-600 px-3 font-bold hover:bg-gray-400 bg-white"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;

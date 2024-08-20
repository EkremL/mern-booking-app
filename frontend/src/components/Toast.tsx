import { useEffect } from "react";

type ToastProps = {
  message: string;
  status: "SUCCESS" | "ERROR";
  onClose: () => void;
};

const Toast = ({ message, status, onClose }: ToastProps) => {
  //!add timer for toast
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const messageStyle =
    status === "SUCCESS"
      ? "fixed top-4 right-4 z-50 p-4 text-white rounded-md bg-green-600 max-w-md "
      : "fixed top-4 right-4 z-50 p-4 text-white rounded-md bg-red-600 max-w-md ";

  return (
    <div className={messageStyle}>
      <div className="flex justify-center items-center">
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;

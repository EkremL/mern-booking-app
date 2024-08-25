import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const GuestsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Guests</h2>
      <div className="grid grid-cols-2 gap-6 bg-gray-400 items-center justify-center py-4 rounded-xl px-6">
        <label className="font-semibold">
          Adults
          <input
            type="number"
            className="border rounded w-full py-1 px-2 font-normal focus:border-indigo-600 focus:outline-none text-black"
            {...register("adultCount", {
              required: "This field is required!",
              min: { value: 1, message: "Minimum 1 adult is required!" },
            })}
          />
          {errors.adultCount && (
            <span className="text-red-500 text-sm font-bold">
              {errors.adultCount.message}
            </span>
          )}
        </label>
        <label className="font-semibold">
          Children
          <input
            type="number"
            className="border rounded w-full py-1 px-2 font-normal focus:border-indigo-600 focus:outline-none text-black"
            {...register("childCount", {
              required: "This field is required!",
              min: { value: 0, message: "Minimum 0 children is required!" },
            })}
          />
          {errors.childCount && (
            <span className="text-red-500 text-sm font-bold">
              {errors.childCount.message}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};

export default GuestsSection;

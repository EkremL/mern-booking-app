import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="bg-indigo-500 py-6 ">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to={"/"}>Fantastic Holidays</Link>
        </span>
        <span className="flex space-x-2 items-center text-white">
          {isLoggedIn ? (
            <>
              <Link
                className="hover:bg-indigo-400 px-2 font-bold"
                to={"/my-bookings"}
              >
                My Bookings
              </Link>
              <Link
                className="hover:bg-indigo-400 px-2 font-bold"
                to={"/my-hotels"}
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to={"/login"}
              className="flex bg-white items-center text-indigo-500 px-3 font-bold hover:bg-gray-100 rounded-lg"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;

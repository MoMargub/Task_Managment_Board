import React from "react";
import { ReactComponent as Logout } from "../assests/svgs/Logout.svg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/", { replace: true });
  };
  return (
    <div className="bg-white shadow h-14">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-center pt-2 flex-grow">
          Kanban By Mohammad Margub Ahmad
        </h1>

        <div className="flex justify-center items-center">
          <Logout
            onClick={handleLogout}
            className="h-6 w-6 text-gray-700 hover:text-red-500 cursor-pointer transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

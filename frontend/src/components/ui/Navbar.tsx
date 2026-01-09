import { useNavigate, NavLink } from "react-router";

import Button from "./Button";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isLogin, SetIsLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      SetIsLogin(true);
    }
  }, []);

  const LogoutFn = () => {
    localStorage.setItem("token", "");
    navigate("/signin");
  };

  return (
    <nav className="md:h-16 h-16 bg-opacity-60 rounded-3xl w-[90%] m-auto bg-primary flex justify-between items-center overflow-hidden ">
      <div className="px-8">
        <NavLink to="/">
          <h1 className="text-xl md:text-2xl font-bold text-white">Brainly</h1>
        </NavLink>
      </div>
      <div className="px-8 flex gap-2 md:gap-4">
        {isLogin ? (
          <>
            <NavLink to="/dashboard">
              <Button variant="primary" size="sm" text="Dashboard" />
            </NavLink>

            <Button
              variant="secondary"
              size="sm"
              text="Logout"
              OnClickFn={LogoutFn}
            />
          </>
        ) : (
          <>
            <NavLink to="/signup">
              <Button variant="primary" size="sm" text="Sign Up" />
            </NavLink>

            <NavLink to="/signin">
              <Button variant="secondary" size="sm" text="Sign In" />
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

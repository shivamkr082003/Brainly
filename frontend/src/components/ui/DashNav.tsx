import { NavLink } from "react-router";
import Button from "./Button";

const DashNav = (props: { menuOpen: boolean; setMenuOpen: () => void }) => {
  return (
    <nav className="md:h-16 h-16 bg-opacity-60 rounded-3xl w-[90%] m-auto bg-primary flex justify-between items-center overflow-hidden">
      <div className="px-8">
        <NavLink to="/" end>
          <h1 className="text-xl md:text-2xl font-bold text-white">Brainly</h1>
        </NavLink>
      </div>
      <div className="px-8 flex gap-2 md:gap-4">
        <div onClick={props.setMenuOpen}>
          <Button variant="secondary" size="sm" text="Menu" />
        </div>
      </div>
    </nav>
  );
};

export default DashNav;

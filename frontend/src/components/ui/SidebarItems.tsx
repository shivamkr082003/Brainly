import { ReactElement } from "react";

interface SidebarItemType {
  startIcon: ReactElement;
  text: string;
  onClickFn?: () => void;
}



const SidebarItems = (props: SidebarItemType) => {

  return (
    <div onClick={props.onClickFn} className="py-1 cursor-pointer px-2 flex gap-3 items-center bg-slate-200  my-3 rounded-lg hover:bg-secondary transition-shadow duration-1000 ease-in ">
      <div className="w-[2rem] h-[2rem] object-cover flex justify-center items-center">
        {props.startIcon}
      </div>
      <h1 className="text-md font-semibold text-primary">{props.text}</h1>
    </div>
  );
};

export default SidebarItems;

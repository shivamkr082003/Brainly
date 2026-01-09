import { ReactElement } from "react";

interface ButtonProps {
  text: String;
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  startIcon?: ReactElement;
  extraClasses?: string;
  OnClickFn?: () => void;
}

const variantStyle = {
  primary: "bg-primary text-white hover:bg-white hover:outline outline-1 hover:text-primary  transition duration-300 ease-in-out max-sm: ",
  secondary: "bg-secondary text-primary hover:bg-purple-600 hover:outline outline-1 hover:text-white transition duration-300 ease-in-out",
};

const sizeStyle = {
  sm: " py-2 px-2  text-sm ",
  md: " py-3 px-6 ",
  lg: " py-3 px-10 text-xl ",
};  

const Button = (props: ButtonProps) => {
  return (
    <button
      onClick={props.OnClickFn}
      className={
        variantStyle[props.variant] +
        sizeStyle[props.size] +
        ` rounded-lg w-fit flex items-center gap-2 + ${props.extraClasses}`
      }>
      {props.startIcon} {props.text}
    </button>
  );
};

export default Button;

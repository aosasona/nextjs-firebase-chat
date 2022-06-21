import type { FC } from "react";

interface Props {
  children: string;
  type: "button" | "submit" | "reset";
  onClick?: () => void;
}

const Button: FC<Props> = ({ children, type = "button", onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full text-sm font-semibold bg-neutral-50 text-neutral-800 hover:bg-neutral-600 hover:text-white focus:bg-neutral-600 transition-all py-4 px-4 rounded-lg"
    >
      {children || "Continue"}
    </button>
  );
};

export default Button;

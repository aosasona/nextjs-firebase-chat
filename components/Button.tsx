import type { FC } from "react";

interface Props {
  children: string;
  name?: string;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

const Button: FC<Props> = ({
  children,
  name,
  type = "button",
  disabled = false,
  onClick,
}) => {
  return (
    <button
      name={name || ""}
      type={type}
      onClick={onClick}
      className="w-full text-sm font-semibold bg-neutral-50 text-neutral-800 hover:scale-95 hover:bg-neutral-600 hover:text-white focus:bg-neutral-600 transition-all py-4 px-4 rounded-lg"
      disabled={disabled}
    >
      {children || "Continue"}
    </button>
  );
};

export default Button;

import React from "react";
import type { FC, ChangeEvent } from "react";

interface Props {
  label?: string;
  name?: string;
  type?: string;
  required?: boolean;
  value: string;
  className?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<Props> = ({
  label,
  name,
  type,
  required = true,
  value,
  className,
  onChange,
}) => {
  return (
    <div
      className={
        className
          ? `flex flex-col gap-y-1 ${className}`
          : "flex flex-col gap-y-1"
      }
    >
      {label && (
        <label className="text-xs font-medium text-neutral-500 px-1 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name || ""}
        className="bg-neutral-800 text-base rounded-lg focus:border-neutral-200 placeholder:text-neutral-700 focus:border-2 focus:outline-none py-4 px-3"
        required={required}
        placeholder={label || ""}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;

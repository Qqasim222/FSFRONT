import React, { HTMLInputTypeAttribute, forwardRef } from "react";

interface CustomInputProps {
  className?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  autoComplete?: string;
}

const CustomInput: React.ForwardRefRenderFunction<HTMLInputElement, CustomInputProps> = (
  { className, type, placeholder, icon, endIcon, id, value, onChange, readOnly, autoComplete },
  ref,
) => {
  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">{icon}</span>
      <input
        ref={ref}
        className={className}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        autoComplete={autoComplete}
      />
      {endIcon && <span className="absolute inset-y-0 right-0 flex items-center pr-3">{endIcon}</span>}
    </div>
  );
};

export default forwardRef<HTMLInputElement, CustomInputProps>(CustomInput);

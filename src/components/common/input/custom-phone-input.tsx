import React from "react";
import { PhoneInput } from "react-international-phone";

interface PhoneInputProps {
  className?: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultCountry?: string;
  style?: React.CSSProperties;
  forceDialCode?: boolean;
}

const CustomPhoneInput: React.FC<PhoneInputProps> = ({
  className,
  type,
  placeholder,
  icon,
  endIcon,
  id,
  value,
  onChange,
  defaultCountry,
  style,
  forceDialCode,
}) => {
  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">{icon}</span>
      <PhoneInput
        style={style}
        defaultCountry={defaultCountry}
        forceDialCode={forceDialCode}
        id={id}
        className={className}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {endIcon && <span className="absolute inset-y-0 right-0 flex items-center pr-3">{endIcon}</span>}
    </div>
  );
};

export default CustomPhoneInput;

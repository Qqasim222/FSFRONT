import React from "react";

interface CustomButtonProps {
  className: string;
  type: "button" | "submit" | "reset";
  label: string;
  endIcon?: React.ReactNode; // Add icon prop
  disabled?: boolean;
  onClick?: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({ className, type, label, disabled, onClick, endIcon }) => {
  return (
    <button className={className} type={type} disabled={disabled} onClick={onClick}>
      <span>{label}</span>
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
};

export default CustomButton;

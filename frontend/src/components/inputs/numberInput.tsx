import React from "react";
import "../../styles/input.css";

const NumberInput = ({
  label,
  by_date,
  num_unit,
}: {
  label?: string;
  by_date?: string;
  num_unit: "년" | "개월" | "원";
}) => {
  return (
    <>
      {label && <label>{label}</label>}
      <div className="input_style">
        {by_date && by_date} <input /> {num_unit}
      </div>
    </>
  );
};

export default NumberInput;

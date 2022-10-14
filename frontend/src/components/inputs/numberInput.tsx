import React from "react";
import ValuesHandler from "../../service/valueHandle";
import "../../styles/input.css";

const value = new ValuesHandler();

const NumberInput = ({
  key,
  label,
  by_date,
  num_unit,
}: {
  key?: string;
  label?: string;
  by_date?: string;
  num_unit: "년" | "개월" | "원";
}) => {
  return (
    <>
      {label && <label>{label}</label>}
      <div className="input_style">
        {by_date && by_date}{" "}
        <input
          onChange={(e) => value.GetInputValue(key, e.target.value)}
          type="text"
        />{" "}
        {num_unit}
      </div>
    </>
  );
};

export default NumberInput;

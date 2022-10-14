import React, { useState } from "react";
import ValuesHandler from "../../service/valueHandle";
import "../../styles/checkbox.css";

const value = new ValuesHandler();

const CheckBoxInput = ({
  key,
  options,
  type,
  label,
}: {
  key?: string;
  options: string[];
  type: "box_type" | "square_type" | "circle_type";
  label?: string;
}) => {
  const [boxSelect, setBoxSelect] = useState<string>(options[0]);
  return (
    <>
      {label && <div>{label}</div>}
      <div className={`checkbox_container ${type}`}>
        {type === "box_type"
          ? options.map((el) => {
              return (
                <div
                  className={`${type} ${el === boxSelect ? "active" : ""}`}
                  onClick={() => {
                    setBoxSelect(el);
                    value.GetInputValue(key, el);
                  }}
                >
                  {el}
                </div>
              );
            })
          : options.map((el: string, idx: number) => {
              return (
                <div className="checkbox_wrapper">
                  <label className="fs_16" htmlFor={`${String(el)}_for${idx}`}>
                    {el}
                  </label>
                  <div
                    className="radio_input_box"
                    key={`${String(Date.now())}_for${idx}`}
                  >
                    <input
                      id={`${String(el)}_for${idx}`}
                      type="radio"
                      name={label ? label : "any_radios"}
                      className="checkbox_list"
                      onChange={() => {
                        value.GetInputValue(key, el);
                      }}
                    />
                    <span className="check_mark"></span>
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
};

export default CheckBoxInput;

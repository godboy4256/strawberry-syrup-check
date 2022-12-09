import React, { ChangeEvent, useState } from "react";
import { money_korean } from "../../utils/pays";
import "../../styles/input.css";

const NumberInput = ({
  params,
  label,
  by_date,
  num_unit,
  callBack,
  placeholder,
  k_parser = true,
  double = false,
}: {
  params?: string | string[];
  label?: string;
  by_date?: string;
  num_unit?: string | string[];
  callBack: CallableFunction;
  placeholder?: string;
  k_parser?: boolean;
  double?: boolean;
}) => {
  const [value, setValue] = useState<string>("");
  const [value2, setValue2] = useState<string>("");
  const onChangeSetValue = (e: ChangeEvent<HTMLInputElement>) => {
    let protoNum = Number(e.currentTarget.value.split(",").join(""));
    let toStringNum = String(Number(protoNum).toLocaleString());
    if (isNaN(protoNum) || toStringNum.length > 11) {
      return;
    } else {
      callBack(Array.isArray(params) ? params[0] : params, protoNum);
      setValue(toStringNum);
    }
  };
  const onClickSetValue2 = (e: ChangeEvent<HTMLInputElement>) => {
    let protoNum: number = Number(e.currentTarget.value.split(",").join(""));
    let toStringNum: string = String(Number(protoNum).toLocaleString());
    callBack(params[1], protoNum);
    setValue2(toStringNum);
  };
  return (
    <>
      {!double ? (
        <div className="w_100">
          {label && <label className="write_label fs_16">{label}</label>}
          <div className={`input_style ${value ? "select" : ""}`}>
            {by_date && by_date}
            {num_unit[0]}
            <input
              value={value}
              placeholder={placeholder && placeholder}
              className={value ? "select" : ""}
              onChange={onChangeSetValue}
              type="text"
            />
            {num_unit[1]}
          </div>
          {k_parser ? (
            <div className="fs_12 kr_value">
              {money_korean(String(value))} 원
            </div>
          ) : null}
        </div>
      ) : (
        <div className="double_numberinput_container">
          {label && <label className="write_label fs_16">{label}</label>}
          <div className="double_numberinput_content">
            <div>
              <div className={`input_style ${value ? "select" : ""}`}>
                {by_date && by_date}
                <input
                  placeholder={placeholder && placeholder}
                  className={value ? "select" : ""}
                  onChange={onChangeSetValue}
                  type="text"
                />
                {num_unit[0]}
              </div>
              {k_parser ? (
                <div className="fs_12 kr_value">
                  {money_korean(String(value))} 원
                </div>
              ) : null}
            </div>
            <div>
              <div className={`input_style ${value2 ? "select" : ""}`}>
                {by_date && by_date}
                <input
                  placeholder={placeholder && placeholder}
                  className={value2 ? "select" : ""}
                  onChange={onClickSetValue2}
                  type="text"
                />
                {num_unit[1]}
              </div>
              {k_parser ? (
                <div className="fs_12 kr_value">
                  {money_korean(String(value2))} 원
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NumberInput;

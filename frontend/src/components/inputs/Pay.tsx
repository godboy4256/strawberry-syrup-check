import { ChangeEvent, useState } from "react";
import { money_korean } from "../../utils/pays";
import IMGHelpIcon from "../../assets/image/new/help_icon.svg";
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
  className,
  guide,
  label_help = false,
}: {
  params?: string | string[];
  label?: string;
  by_date?: string;
  num_unit?: string | string[];
  callBack?: CallableFunction;
  placeholder?: string;
  k_parser?: boolean;
  double?: boolean;
  className?: string;
  guide?: boolean;
  label_help?: boolean;
}) => {
  const [value, setValue] = useState<string>("");
  const [value2, setValue2] = useState<string>("");
  const onChangeSetValue = (e: ChangeEvent<HTMLInputElement>) => {
    let protoNum = Number(e.currentTarget.value.split(",").join(""));
    let toStringNum = String(Number(protoNum).toLocaleString());
    if (isNaN(protoNum) || toStringNum.length > 11) {
      return;
    } else {
      callBack &&
        callBack(Array.isArray(params) ? params[0] : params, protoNum);
      setValue(toStringNum);
    }
  };
  const onClickSetValue2 = (e: ChangeEvent<HTMLInputElement>) => {
    let protoNum: number = Number(e.currentTarget.value.split(",").join(""));
    let toStringNum: string = String(Number(protoNum).toLocaleString());
    callBack && callBack(params?.[1], protoNum);
    setValue2(toStringNum);
  };
  return (
    <>
      {!double ? (
        <div className="w_100">
          {guide ? (
            <div className="flex_box write_label write_label_and_guide">
              {label && (
                <label className="fs_16 help_call">
                  {label}
                  {label_help && <img src={IMGHelpIcon} alt="help icon" />}
                </label>
              )}
              <div className="font_color_gray fs_12 write_label_guide">
                월 최저임금
                <br /> 9620원
              </div>
            </div>
          ) : (
            label && (
              <label className="fs_16 write_label help_call">
                {label}
                {label_help && <img src={IMGHelpIcon} alt="help icon" />}
              </label>
            )
          )}

          <div className={`fs_14 input_style ${value ? "select" : ""}`}>
            {by_date && by_date}
            <input
              value={value}
              placeholder={placeholder && placeholder}
              className={`${value2 ? "select" : ""} ${
                className ? className : ""
              }`}
              onChange={onChangeSetValue}
              type="text"
            />
            {num_unit?.[1]}
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
              <div className={`fs_14 input_style ${value ? "select" : ""}`}>
                {by_date && by_date}
                <input
                  placeholder={placeholder && placeholder}
                  className={`${value2 ? "select" : ""} ${
                    className ? className : ""
                  }`}
                  onChange={onChangeSetValue}
                  type="text"
                />
                {num_unit?.[0]}
              </div>
              {k_parser ? (
                <div className="fs_12 kr_value">
                  {money_korean(String(value))} 원
                </div>
              ) : null}
            </div>
            <div>
              <div className={`fs_14 input_style ${value2 ? "select" : ""}`}>
                {by_date && by_date}
                <input
                  placeholder={placeholder && placeholder}
                  className={`${value2 ? "select" : ""} ${
                    className ? className : ""
                  }`}
                  onChange={onClickSetValue2}
                  type="text"
                />
                {num_unit?.[1]}
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

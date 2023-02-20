import { Fragment, useEffect, useState } from "react";
import "../../styles/checkbox.css";
import IMGHelpIcon from "../../assets/image/new/help_icon.svg";
import { CreatePopup } from "../common/Popup";

let checkList: string[] = [];

const _BoxTypeCheckBox = ({
  el,
  type,
  callBack,
  params,
  maxLenth,
  label,
}: {
  el: string;
  type: string;
  callBack: CallableFunction;
  params: string;
  maxLenth?: number;
  label?: string;
}) => {
  const [onSelect, setOnSelect] = useState(false);
  return (
    <div
      className={`${type} ${onSelect ? "active" : ""} fs_14`}
      onClick={() => {
        if (maxLenth)
          if (checkList.length === maxLenth) {
            if (onSelect === false) {
              CreatePopup(
                undefined,
                `${label}은 ${maxLenth}개까지 선택할 수 있습니다.`,
                "only_check"
              );
              return;
            }
          }
        setOnSelect((prev) => !prev);
        if (!onSelect) {
          checkList.push(el);
        } else {
          const delete_num = checkList.indexOf(el);
          checkList.splice(delete_num, 1);
        }
        callBack(params, checkList);
      }}
    >
      {el}
    </div>
  );
};

const CheckBoxInput = ({
  label_help = false,
  options,
  type,
  label,
  params,
  callBack,
  selected,
  maxLenth,
}: {
  label_help?: boolean;
  options: string[];
  type: "box_type" | "radio_box_type" | "circle_type" | "is_true_type";
  label?: string;
  params: string;
  callBack: CallableFunction;
  selected?: string;
  maxLenth?: number;
}) => {
  useEffect(() => {
    return () => {
      checkList = [];
      console.log(checkList);
    };
  });
  return (
    <>
      <label className="fs_16 write_label help_call">
        {label}
        {label_help && <img src={IMGHelpIcon} alt="help icon" />}
      </label>
      <div className={`checkbox_container ${type}`}>
        {type === "box_type"
          ? options.map((el: string) => {
              return (
                <_BoxTypeCheckBox
                  maxLenth={maxLenth}
                  key={`${String(Date.now())}_for${el}`}
                  el={el}
                  type={type}
                  params={params}
                  callBack={callBack}
                  label={label}
                />
              );
            })
          : type === "circle_type"
          ? options.map((el: string | number, idx: number) => {
              return (
                <div
                  className="checkbox_wrapper"
                  key={`${String(Date.now())}_for${el}`}
                >
                  <label className="fs_16" htmlFor={`${String(el)}_for${idx}`}>
                    {el}
                  </label>
                  <div className="radio_input_box">
                    <input
                      id={`${String(el)}_for${idx}`}
                      type="radio"
                      name={label ? label : "any_radios"}
                      className="checkbox_list"
                      defaultChecked={selected === el ? true : false}
                      onChange={() => {
                        callBack(params, el);
                      }}
                    />
                    <span className="check_mark"></span>
                  </div>
                </div>
              );
            })
          : type === "radio_box_type"
          ? options.map((el: string | number, idx: number) => {
              return (
                <Fragment key={`${String(Date.now())}_for${el}`}>
                  <input
                    id={`${String(el)}_for${idx}`}
                    type="radio"
                    name={label ? label : "any_radios"}
                    className="checkbox_list"
                    onChange={() => callBack(params, el)}
                  />
                  <label className="fs_16" htmlFor={`${String(el)}_for${idx}`}>
                    {el}
                  </label>
                </Fragment>
              );
            })
          : type === "is_true_type" && (
              <div className="checkbox_wrapper">
                <label htmlFor={`${type}_box`} className="fs_16">
                  {options[0]}
                </label>
                <div className="radio_input_box">
                  <input
                    id={`${type}_box`}
                    type="checkbox"
                    className="checkbox_list"
                    onChange={(e) => {
                      callBack(params, e.target.checked);
                    }}
                  />
                  <span className="check_mark"></span>
                </div>
              </div>
            )}
      </div>
    </>
  );
};

export default CheckBoxInput;

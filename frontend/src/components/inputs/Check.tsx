import { Fragment } from "react";
import "../../styles/checkbox.css";
import IMGHelpIcon from "../../assets/image/new/help_icon.svg";
import { CreatePopup } from "../common/popup";
import { useRecoilState, useSetRecoilState } from "recoil";
import { weeKDayState } from "../../assets/atom/weekDay";
import { disabledCheck, isSpecialCheck } from "../../assets/atom/checkbox";

const _BoxTypeCheckBox = ({
  el,
  idx,
  type,
  callBack,
  params,
  maxLenth,
  label,
}: {
  el: string;
  idx: number;
  type: string;
  callBack: CallableFunction;
  params: string;
  maxLenth?: number;
  label?: string;
}) => {
  const [onSelect, setOnSelect] = useRecoilState<any>(weeKDayState);
  const checkList: number[] = [];
  return (
    <div
      className={`${type} ${onSelect[idx] ? "active" : ""} fs_14`}
      onClick={() => {
        const onSelectUpdate = onSelect.map((el: any, idx_in: number) => {
          if (idx_in === idx) {
            return el === true ? false : true;
          }
          return el;
        });
        onSelectUpdate.forEach((el: any, idx_in: number) => {
          if (el) {
            checkList.push(idx_in);
          }
        });

        if (maxLenth)
          if (checkList.length === maxLenth + 1) {
            CreatePopup(
              undefined,
              `${label}은 ${maxLenth}개까지 선택할 수 있습니다.`,
              "only_check"
            );
            return;
          }
        setOnSelect(onSelectUpdate);
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
  const setChecked = useSetRecoilState(disabledCheck);
  const [isSpecial, setIsSpecial] = useRecoilState(isSpecialCheck);
  return (
    <>
      <label className="fs_16 write_label help_call">
        {label}
        {label_help && <img src={IMGHelpIcon} alt="help icon" />}
      </label>
      <div className={`checkbox_container ${type}`}>
        {type === "box_type"
          ? options.map((el: string, idx: number) => {
              return (
                <_BoxTypeCheckBox
                  idx={idx}
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
                  <label className="fs_16" htmlFor={`check_option_for${idx}`}>
                    {el}
                  </label>
                  <div className="radio_input_box">
                    <input
                      id={`check_option_for${idx}`}
                      type="radio"
                      name={label ? label : "any_radios"}
                      className="checkbox_list"
                      defaultChecked={selected === el ? true : false}
                      onChange={() => {
                        if (params === "disabled") {
                          typeof el === "string" && setChecked(el);
                        }
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
                      if (params === "isSpecial") {
                        setIsSpecial(e.target.checked);
                      }
                      callBack(params, e.target.checked);
                    }}
                  />
                  {isSpecial && <span className="check_mark"></span>}
                </div>
              </div>
            )}
      </div>
    </>
  );
};

export default CheckBoxInput;

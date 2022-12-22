import { ChangeEvent, MouseEvent, ReactElement, useState } from "react";
import IMGSelect from "../../assets/image/select_icon.svg";
import IMGNormalSelect from "../../assets/image/new/select_icon_normal.svg";
import "../../styles/select.css";
import { ClosePopup, CreatePopup } from "../common/Popup";

const PopupSelect = ({
  options,
  callBack,
  params,
  popup_select,
}: {
  options: string[] | number[];
  callBack?: CallableFunction;
  params: string;
  popup_select?: CallableFunction;
}) => {
  const [select, setSelect] = useState<number>(
    popup_select && (popup_select("workCate") ? popup_select("workCate") : 0)
  );
  return (
    <div className="popup_select_container">
      {options?.map((el: string | number, idx: number) => (
        <div
          className={`popup_select_option pd_810 fs_16 ${
            idx === select ? "select" : ""
          }`}
          key={String(Date.now()) + el}
          onClick={() => {
            setSelect(idx);
            callBack && callBack(params, idx);
          }}
        >
          {el}
        </div>
      ))}
    </div>
  );
};

const SelectInput = ({
  selected,
  options,
  label,
  type = "normal",
  popup_focus_template,
  params,
  callBack,
  popUpCallBack,
  popup_select,
  check_popup,
  value_type,
}: {
  selected?: number | string;
  options: string[] | number[];
  label?: string;
  type?: "popup" | "normal" | "date_normal";
  popup_focus_template?: ReactElement;
  params: string;
  callBack: CallableFunction | undefined;
  popUpCallBack?: CallableFunction;
  popup_select?: CallableFunction;
  check_popup?: string[];
  value_type?: "number" | "string";
}) => {
  const onClickOnOptionList = (e: MouseEvent<HTMLDivElement>) => {
    CreatePopup(
      label,
      <PopupSelect
        options={options}
        callBack={callBack}
        params="popup_select"
        popup_select={popup_select}
      />,
      "confirm",
      () => {
        if (!popup_select) return;
        if (check_popup) {
          CreatePopup(
            undefined,
            check_popup[popup_select("popup_select")],
            "confirm",
            () => {
              popUpCallBack &&
                popUpCallBack(params, popup_select("popup_select"));
              ClosePopup();
            },
            () => {}, // 다시 선택하면 돌아갈 수 있도록 함수 분리
            "예",
            "아니오"
          );
        } else {
          popUpCallBack && popUpCallBack(params, popup_select("popup_select"));
          ClosePopup();
        }
      },
      undefined,
      "확인",
      "취소"
    );
  };

  return (
    <>
      {type === "popup" ? (
        <div className="w_100" onClick={onClickOnOptionList}>
          {popup_focus_template}
        </div>
      ) : type === "date_normal" ? (
        <div id={type} className="select_custom">
          <select
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              callBack && callBack(params, e.currentTarget.value);
            }}
            defaultValue={selected}
          >
            {options.map((el: string | number, idx: number) => {
              return (
                <option key={idx + Date.now()} value={el}>
                  {el}
                </option>
              );
            })}
          </select>
          <img src={IMGSelect} alt="Select Icon" />
        </div>
      ) : (
        type === "normal" && (
          <>
            {label && <label className="fs_16 write_label">{label}</label>}
            <div id={type} className="select_custom">
              <select
                className="fs_14"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  e.currentTarget.parentElement &&
                    e.currentTarget.parentElement.classList.add("active");
                  callBack &&
                    callBack(
                      params,
                      value_type === "string"
                        ? e.currentTarget.value
                        : Number(e.currentTarget.value)
                    );
                }}
                defaultValue={selected}
              >
                {options.map((el: string | number, idx: number) => {
                  return (
                    <option
                      id={String(idx)}
                      className="fs_14"
                      key={idx + Date.now()}
                      value={value_type === "string" ? el : idx}
                    >
                      {el}
                    </option>
                  );
                })}
              </select>
              <div className="select_icon">
                <img src={IMGNormalSelect} alt="Select Icon" />
              </div>
            </div>
          </>
        )
      )}
    </>
  );
};

export default SelectInput;

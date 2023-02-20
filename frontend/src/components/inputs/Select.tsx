import { MouseEvent, ReactElement, useEffect, useState } from "react";
import IMGSelect from "../../assets/image/select_icon.svg";
import IMGNormalSelect from "../../assets/image/new/select_icon_normal.svg";
import { ClosePopup, CreatePopup } from "../common/Popup";
import "../../styles/select.css";

const _CustomSelect = ({
  options,
  option_func,
  select_ment = "선택해 주세요.",
  className,
  select_icon,
  defaultSelect,
}: {
  options: string[] | number[];
  option_func: (
    el: string | number,
    e: MouseEvent<HTMLDivElement>,
    idx: number
  ) => void;
  select_ment?: string | number;
  className?: string;
  select_icon?: string;
  defaultSelect?: string | number;
}) => {
  const [onSelect, setOnSelect] = useState(false);
  const [select, setSelect] = useState<string | number>();
  return (
    <div
      className={`custom_select ${className ? className : ""}`}
      onClick={() => setOnSelect((prev) => !prev)}
    >
      {defaultSelect ? (
        <div className="custom_select_title">
          {defaultSelect ? defaultSelect : select_ment}
        </div>
      ) : (
        <div className="custom_select_title">
          {select ? select : select_ment}
        </div>
      )}

      <div
        className="custom_options"
        style={{
          overflowY: onSelect ? "scroll" : "hidden",
        }}
        onBlur={() => setOnSelect(false)}
      >
        {onSelect &&
          options.map((el, idx: number) => {
            return (
              <div
                key={String(Date.now()) + el}
                onClick={(e: MouseEvent<HTMLDivElement>) => {
                  option_func(el, e, idx);
                  setSelect(el);
                }}
              >
                {el}
              </div>
            );
          })}
      </div>
      <div className="icon_cover">
        <img
          src={select_icon}
          className="custom_select_icon"
          alt="custom select icon"
        />
      </div>
    </div>
  );
};

const PopupSelect = ({
  options,
  callBack,
  params,
  select_params,
  popup_select,
}: {
  options: string[] | number[];
  callBack?: CallableFunction;
  params: string;
  select_params: string;
  popup_select?: CallableFunction;
}) => {
  const [select, setSelect] = useState<number>(
    popup_select &&
      (popup_select(select_params) ? popup_select(select_params) : 0)
  );
  useEffect(() => {
    callBack && callBack(params, undefined);
  }, []);
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
  defaultSelect,
  className,
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
  defaultSelect?: number | string;
  className?: string;
}) => {
  const onClickOnOptionList = () => {
    CreatePopup(
      label,
      <PopupSelect
        options={options}
        callBack={callBack}
        params="popup_select"
        select_params={params}
        popup_select={popup_select}
      />,
      "confirm",
      () => {
        if (!popup_select) return;
        if (check_popup) {
          CreatePopup(
            undefined,
            check_popup[popup_select("popup_select")] === undefined
              ? check_popup[0]
              : check_popup[popup_select("popup_select")],
            "confirm",
            () => {
              popUpCallBack &&
                popUpCallBack(params, popup_select("popup_select"));
              ClosePopup();
            },
            () => {},
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
        <>
          <_CustomSelect
            options={options}
            option_func={(el: string | number) =>
              callBack && callBack(params, el)
            }
            select_ment={options[0]}
            select_icon={IMGSelect}
            className="date_normal_style"
            defaultSelect={defaultSelect}
          />
        </>
      ) : (
        type === "normal" && (
          <>
            {label && <label className="fs_16 write_label">{label}</label>}
            <_CustomSelect
              options={options}
              option_func={(
                el: string | number,
                e: MouseEvent<HTMLDivElement>,
                idx?: number
              ) => {
                e?.currentTarget?.parentElement?.parentElement?.classList?.add(
                  "active"
                );
                if (value_type === "number") {
                  callBack && options && callBack(params, idx);
                } else {
                  callBack && callBack(params, el);
                }
              }}
              select_ment={options[0]}
              select_icon={IMGNormalSelect}
              className={`normal_style ${className ? className : ""}`}
            />
          </>
        )
      )}
    </>
  );
};

export default SelectInput;

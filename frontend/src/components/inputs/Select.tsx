import { MouseEvent, ReactElement, useEffect, useState } from "react";
import IMGSelect from "../../assets/image/select_icon.svg";
import IMGNormalSelect from "../../assets/image/new/select_icon_normal.svg";
import { ClosePopup, CreatePopup } from "../common/popup";
import "../../styles/select.css";
import { jobCates_ed } from "../../assets/data/worktype_data";

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
  type?: "popup" | "normal" | "date_normal";
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
            if (idx === 0) return null;
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

export const PopupSelect = ({
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

const _EmploymentPopUp = ({ job, jobed }: { job: string; jobed: string }) => {
  return (
    <div className="string_popup txt_ct fs_12">
      <div>선택하신 직종의 고용보험이 적용되는 시행일은 다음과 같습니다.</div>
      <br /> <br />
      <div>
        <div className="fs_16 lh_27">{job}</div>
        <div className="fs_16 lh_27">{jobed}</div>
      </div>
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
  check_popup?: string[] | ReactElement[] | "employ";
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
        if (
          check_popup === "employ" ||
          String(options[popup_select && popup_select("popup_select")]) ===
            "소득감소"
        ) {
          popUpCallBack &&
            popUpCallBack(params, popup_select && popup_select("popup_select"));
          ClosePopup();
          return;
        }
        if (!popup_select) return;
        if (check_popup) {
          CreatePopup(
            popup_select("popup_select") === undefined
              ? String(options[0])
              : String(options[popup_select("popup_select")]),
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
                if (params === "jobCate") {
                  CreatePopup(
                    undefined,
                    <_EmploymentPopUp
                      job={String(el)}
                      jobed={
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(Number(idx))
                          ? jobCates_ed[0]
                          : [11, 12].includes(Number(idx))
                          ? jobCates_ed[1]
                          : [13, 14, 15, 16, 17].includes(Number(idx))
                          ? jobCates_ed[2]
                          : ""
                      }
                    />,
                    "only_check",
                    undefined,
                    undefined,
                    "확인"
                  );
                }
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

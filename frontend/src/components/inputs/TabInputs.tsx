import { Fragment, useState } from "react";
import NumberInput from "./Pay";
import SelectInput from "./Select";
import { GetDateArr } from "../../utils/date";
import IMGHelpIcon from "../../assets/image/new/help_icon.svg";
import { CreatePopup } from "../common/popup";
import "../../styles/salarytab.css";
import { useRecoilState } from "recoil";
import { tabStateSalary } from "../../assets/atom/tab";

const before_month_cal = (retiredDay: Date) => {
  let startMonth = new Date(retiredDay).getMonth() - 2;
  let startYear = new Date(retiredDay).getFullYear();

  if (startMonth < 0) {
    startMonth += 12;
    startYear--;
  }
  let monthRange = [];

  for (var i = 0; i < 4; i++) {
    let year = startYear;
    let month = startMonth + i;

    if (month >= 12) {
      year++;
      month -= 12;
    }

    const dateObj = new Date(year, month, new Date(retiredDay).getDate());

    monthRange.push({
      year:
        dateObj.getMonth() === 0
          ? dateObj.getFullYear() - 1
          : dateObj.getFullYear(),
      month: dateObj.getMonth() === 0 ? 12 : dateObj.getMonth(),
      day: dateObj.getDate(),
    });
  }

  return [
    `${monthRange[2].year}.${String(monthRange[2].month).padStart(
      2,
      "0"
    )}.${String(monthRange[2].day).padStart(2, "0")} ~ ${
      monthRange[3].year
    }.${String(monthRange[3].month).padStart(2, "0")}.${String(
      String(monthRange[3].day).padStart(2, "0")
    ).padStart(2, "0")}`,
    `${monthRange[1].year}.${String(monthRange[1].month).padStart(
      2,
      "0"
    )}.${String(monthRange[1].day).padStart(2, "0")} ~ ${
      monthRange[2].year
    }.${String(monthRange[2].month).padStart(2, "0")}.${String(
      monthRange[2].day
    ).padStart(2, "0")}`,
    `${monthRange[0].year}.${String(monthRange[0].month).padStart(
      2,
      "0"
    )}.${String(monthRange[0].day).padStart(2, "0")} ~ ${
      monthRange[1].year
    }.${String(monthRange[1].month).padStart(2, "0")}.${String(
      monthRange[1].day
    ).padStart(2, "0")}`,
  ];
};

const TabInputs = ({
  label,
  callBack,
  params,
  valueDay = () => {},
  type = "normal",
  guide = true,
  label_help = false,
}: {
  label?: string;
  callBack?: CallableFunction;
  params?: string;
  valueDay?: CallableFunction;
  type?: "normal" | "salary" | "select";
  guide?: boolean;
  label_help?: boolean;
}) => {
  const multi_salary_data: any = {};
  const [salarytab, setSalaryTab] = useRecoilState(tabStateSalary);
  const onChangeTabInput = (in_params: string, value: string) => {
    multi_salary_data[in_params] = value;
    callBack && callBack(params, Object.values(multi_salary_data));
  };

  return (
    <>
      {guide ? (
        <div className="flex_box write_label write_label_and_guide">
          <div className="fs_16">{label}</div>
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
      <div id="salary_tab_container">
        <div id="salary_tab_header" className={salarytab}>
          <button
            className={`fs_16 ${salarytab === "all" ? "all" : ""} ${
              salarytab == "three_month" ? "un_three_month" : ""
            }`}
            onClick={() => setSalaryTab("all")}
          >
            모두 동일
          </button>
          <button
            className={`fs_16 ${
              salarytab === "three_month" ? "three_month" : ""
            } ${salarytab == "all" ? "un_all" : ""}`}
            onClick={() => {
              if (valueDay("retired")) {
                if (valueDay("retiredDay") && valueDay("enterDay")) {
                  setSalaryTab("three_month");
                } else {
                  CreatePopup(
                    undefined,
                    "퇴사일(고용보험 종료일) 과 입사일(고용보험 가입일)을 모두 선택해주세요.",
                    "only_check"
                  );
                }
              } else {
                setSalaryTab("three_month");
              }
            }}
          >
            퇴직전 3개월
          </button>
        </div>
        <div
          id={`${
            type === "salary" ? "salary_tab_content" : "select_tab_content"
          }`}
          className={salarytab}
        >
          {type === "salary" &&
            (salarytab === "all" ? (
              <NumberInput
                placeholder="금액을 입력해주세요. (단위 : 원)"
                params={params}
                num_unit="원"
                callBack={callBack}
              />
            ) : (
              salarytab === "three_month" && (
                <>
                  <div className="fs_14">
                    {before_month_cal(valueDay && valueDay("retiredDay"))[0]}
                  </div>
                  <NumberInput
                    params="salary_01"
                    num_unit="원"
                    callBack={onChangeTabInput}
                    placeholder="금액을 입력해주세요. (단위 : 원)"
                    guide={false}
                  />
                  <div className="fs_14">
                    {before_month_cal(valueDay && valueDay("retiredDay"))[1]}
                  </div>
                  <NumberInput
                    params="salary_02"
                    num_unit="원"
                    callBack={onChangeTabInput}
                    placeholder="금액을 입력해주세요. (단위 : 원)"
                    guide={false}
                  />
                  <div className="fs_14">
                    {before_month_cal(valueDay && valueDay("retiredDay"))[2]}
                  </div>
                  <NumberInput
                    params="salary_03"
                    num_unit="원"
                    callBack={onChangeTabInput}
                    placeholder="금액을 입력해주세요. (단위 : 원)"
                    guide={false}
                  />
                </>
              )
            ))}
          {type === "select" &&
            (salarytab === "all" ? (
              <SelectInput
                selected={"1등급"}
                type="normal"
                value_type="string"
                options={[
                  "등급을 선택해주세요.",
                  "1등급",
                  "2등급",
                  "3등급",
                  "4등급",
                  "5등급",
                  "6등급",
                  "7등급",
                ]}
                params="year0"
                callBack={callBack ? callBack : undefined}
              />
            ) : (
              salarytab === "three_month" &&
              valueDay("retiredDay") &&
              valueDay("enterDay") && (
                <>
                  {new Array(
                    Number(
                      GetDateArr(valueDay("retiredDay"))[0] -
                        GetDateArr(valueDay("enterDay"))[0]
                    ) + 1
                  )
                    .fill(1)
                    .map((_, idx: number) => {
                      return (
                        <Fragment key={String(Date.now())}>
                          <div className="fs_14 pd_810">
                            {GetDateArr(valueDay("enterDay"))[0] + idx} 년
                          </div>{" "}
                          <SelectInput
                            type="normal"
                            value_type="string"
                            options={[
                              "등급을 선택해주세요.",
                              "1등급",
                              "2등급",
                              "3등급",
                              "4등급",
                              "5등급",
                              "6등급",
                              "7등급",
                            ]}
                            params={`year${idx}`}
                            callBack={callBack}
                          />
                        </Fragment>
                      );
                    })}
                </>
              )
            ))}
        </div>
      </div>
      <div className="fs_12 out_description">
        ※ 퇴직전 3개월 간 급여가 다를 경우 각각 입력
      </div>
    </>
  );
};

export default TabInputs;

import { Fragment, useState } from "react";
import NumberInput from "./Pay";
import SelectInput from "./Select";
import { GetDateArr } from "../../utils/date";
import { CreatePopup } from "../common/Popup";
import "../../styles/salarytab.css";

const before_month_cal = (retiredDay: string) => {
  let now = retiredDay ? new Date(retiredDay) : new Date();

  let threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 2);

  let startDate = new Date(
    threeMonthsAgo.getFullYear(),
    threeMonthsAgo.getMonth(),
    1
  );
  let endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  let yearRange = [];
  let monthRange = [];

  for (
    let year = startDate.getFullYear();
    year <= endDate.getFullYear();
    year++
  ) {
    yearRange.push(year);
    let startMonth =
      year === startDate.getFullYear() ? startDate.getMonth() : 0;
    let endMonth = year === endDate.getFullYear() ? endDate.getMonth() : 11;
    for (let month = startMonth; month <= endMonth; month++) {
      monthRange.push({
        year: year,
        month: month === 0 ? 12 : month,
        day: now.getDate(),
      });
    }
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
}: {
  label?: string;
  callBack?: CallableFunction;
  params?: string;
  valueDay?: CallableFunction;
  type?: "normal" | "salary" | "select";
}) => {
  const multi_salary_data: any = {};
  const [salarytab, setSalaryTab] = useState("all");
  const onChangeTabInput = (in_params: string, value: string) => {
    multi_salary_data[in_params] = value;
    callBack && callBack(params, Object.values(multi_salary_data));
  };
  return (
    <>
      <div className="flex_box write_label write_label_and_guide">
        <div className="fs_16">{label}</div>
        <div className="font_color_gray fs_12 write_label_guide">
          월 최저임금
          <br /> 9620원
        </div>
      </div>
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
                if (valueDay("retiredDay")) {
                  setSalaryTab("three_month");
                } else {
                  CreatePopup(
                    undefined,
                    "퇴사일을 선택해주세요.",
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
                  />
                  <div className="fs_14">
                    {before_month_cal(valueDay && valueDay("retiredDay"))[1]}
                  </div>
                  <NumberInput
                    params="salary_02"
                    num_unit="원"
                    callBack={onChangeTabInput}
                    placeholder="금액을 입력해주세요. (단위 : 원)"
                  />
                  <div className="fs_14">
                    {before_month_cal(valueDay && valueDay("retiredDay"))[2]}
                  </div>
                  <NumberInput
                    params="salary_03"
                    num_unit="원"
                    callBack={onChangeTabInput}
                    placeholder="금액을 입력해주세요. (단위 : 원)"
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
                          <div>
                            {GetDateArr(valueDay("enterDay"))[0] + idx} 년
                          </div>
                          <SelectInput
                            selected={"1등급"}
                            type="normal"
                            value_type="string"
                            options={[
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
      <div className="fs_12">※ 퇴직전 3개월 간 급여가 다를 경우 각각 입력</div>
    </>
  );
};
export default TabInputs;

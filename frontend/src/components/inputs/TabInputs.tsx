import { Fragment, useState } from "react";
import NumberInput from "./Pay";
import SelectInput from "./Select";
import { GetDateArr } from "../../utils/date";
import { CreatePopup } from "../common/Popup";
import "../../styles/salarytab.css";

const before_month_cal = (retiredDay: string) => {
  const targetDate = retiredDay.split("-"),
    year_slice = Number(targetDate[0].slice(2)),
    month1 = Number(targetDate[1]),
    month2 = Number(targetDate[1]) - 1 === 0 ? 12 : Number(targetDate[1]) - 1,
    month3 = month2 - 1 === 0 ? 12 : month2 - 1,
    year1 = year_slice,
    year2 = month2 > month1 ? year_slice - 1 : year_slice,
    year3 = month3 > month2 ? year_slice - 1 : year_slice;
  return [
    `${year1}.${String(month1).padStart(2, "0")}.${
      targetDate[2]
    }. ~ ${year1}.${String(month1).padStart(2, "0")}.${targetDate[2]}.`,
    `${year2}.${String(month2).padStart(2, "0")}.${
      targetDate[2]
    }. ~${year1}.${String(month2).padStart(2, "0")}.${targetDate[2]}.`,
    `${year3}.${String(month3).padStart(2, "0")}.${
      targetDate[2]
    }.~${year1}.${String(month3).padStart(2, "0")}.${targetDate[2]}.`,
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
      <div className="fs_16 write_label">{label}</div>
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
              <NumberInput params={params} num_unit="원" callBack={callBack} />
            ) : (
              salarytab === "three_month" && (
                <>
                  <div className="fs_14">
                    {before_month_cal(valueDay && valueDay("retiredDay"))?.[0]}
                  </div>
                  <NumberInput
                    params="salary_01"
                    num_unit="원"
                    callBack={onChangeTabInput}
                  />
                  <div className="fs_14">
                    {before_month_cal(valueDay && valueDay("retiredDay"))?.[1]}
                  </div>
                  <NumberInput
                    params="salary_02"
                    num_unit="원"
                    callBack={onChangeTabInput}
                  />
                  <div className="fs_14">
                    {before_month_cal(valueDay && valueDay("retiredDay"))?.[2]}
                  </div>
                  <NumberInput
                    params="salary_03"
                    num_unit="원"
                    callBack={onChangeTabInput}
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
                options={["1등급", "2등급", "3등급", "4등급", "5등급"]}
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

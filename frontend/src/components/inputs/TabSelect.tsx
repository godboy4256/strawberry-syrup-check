import { Fragment } from "react";
import SelectInput from "./Select";
import { GetDateArr } from "../../utils/date";
import IMGHelpIcon from "../../assets/image/new/help_icon.svg";
import { CreatePopup } from "../common/popup";
import "../../styles/salarytab.css";
import { useRecoilState } from "recoil";
import { tabStateSalary } from "../../assets/atom/tab";

const TabSelects = ({
  handler,
  label,
  callBack,
  valueDay = () => {},
  label_help = false,
}: {
  handler?: any;
  label?: string;
  callBack?: CallableFunction;
  valueDay?: CallableFunction;
  label_help?: boolean;
}) => {
  const [salarytab, setSalaryTab] = useRecoilState(tabStateSalary);
  return (
    <>
      {label && (
        <label className="fs_16 write_label help_call">
          {label}
          {label_help && <img src={IMGHelpIcon} alt="help icon" />}
        </label>
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
        <div id="select_tab_content">
          {salarytab === "all" ? (
            <SelectInput
              handler={handler}
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
                      <Fragment key={String(Date.now()) + idx}>
                        <div className="fs_14 pd_810">
                          {GetDateArr(valueDay("enterDay"))[0] + idx} 년
                        </div>{" "}
                        <SelectInput
                          handler={handler}
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
                          params={`year${idx}`}
                          callBack={callBack}
                        />
                      </Fragment>
                    );
                  })}
              </>
            )
          )}
        </div>
      </div>
      <div className="fs_12 out_description">
        ※ 퇴직전 3개월 간 급여가 다를 경우 각각 입력
      </div>
    </>
  );
};
export default TabSelects;

import { ReactElement } from "react";
import "../../styles/calcontainer.css";

const CalContainer = ({
  children,
  type,
  GetValue,
}: {
  children: ReactElement;
  type: string;
  GetValue?: CallableFunction;
}) => {
  const workCate =
    GetValue &&
    (GetValue("workCate") === 0
      ? "> 정규직"
      : GetValue("workCate") === 1
      ? "> 기간제"
      : GetValue("workCate") === 2
      ? "> 예술인"
      : GetValue("workCate") === 3
      ? "> 특고"
      : GetValue("workCate") === 4
      ? "> 일용직"
      : GetValue("workCate") === 5
      ? "> 초단 시간"
      : GetValue("workCate") === 6
      ? "> 자영업"
      : "");

  return (
    <div id="cal_container" className="header_top_space">
      <div
        id="cal_current_guide"
        className={`pd_810 fs_14 ${type === "복수형" ? "multi_margin" : ""}`}
      >
        {`${type} ${
          GetValue &&
          GetValue("cal_state") !== "multi" &&
          GetValue("retired") !== undefined
            ? GetValue("retired")
              ? "> 퇴직자"
              : "> 퇴직예정자"
            : ""
        } ${workCate}`}
      </div>
      {children}
    </div>
  );
};

export default CalContainer;

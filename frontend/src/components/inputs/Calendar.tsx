import { useState } from "react";
import IMGDate from "../../assets/image/date_icon.svg";
import IMGRedDirection from "../../assets/image/red_direction.svg";
import SelectInput, { PopupSelect } from "./Select";
import { GetDateArr, Year_Option_Generater } from "../../utils/date";
import "../../styles/date.css";
import Button from "./Button";
import { ClosePopup, CreatePopup } from "../common/popup";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  ageState,
  enterDayeState,
  lastWorkDayState,
  planToDoState,
  retiredDayeState,
} from "../../assets/atom/date";
import { duplicationDateCheck } from "../../assets/atom/multi";

const Days_Option_Generater = (year: number, month: number) => {
  const days_arr = new Array(new Date(year, month - 1, 1).getDay()).fill("");
  const days_count = new Date(year, month, 0).getDate();
  for (let i = 0; i < days_count; i++) {
    days_arr.push(String(i + 1));
  }
  return days_arr;
};

const Format_Korean_Date = (date: string) => {
  const target = date.split("-");
  return `${target[0]}년 ${target[1]}월 ${target[2]}일`;
};

const min_month_arr = (min_month: string | number) => {
  let answer: any = [];
  for (let i = 0; i < 12 - Number(min_month); i++) {
    answer.push(Number(min_month) + i);
  }
  return answer;
};

const Calendar = ({
  handler,
  max_date,
  min_date,
  params,
  label,
  placeholder,
  alarm,
  time_select,
}: {
  handler: any;
  max_date?: any;
  min_date?: any;
  params: string;
  label?: string;
  alarm?: string;
  placeholder?: string;
  time_select?: boolean;
}) => {
  const currentDate = GetDateArr(null);
  const [date, setDate] = useRecoilState<any>(
    params === "age" || params === "age_multi"
      ? ageState
      : params === "enterDay"
      ? enterDayeState
      : params === "lastWorkDay"
      ? lastWorkDayState
      : params === "retiredDay"
      ? retiredDayeState
      : params === "planToDo"
      ? planToDoState
      : ageState
  );

  const [year, setYear] = useState(currentDate[0]);
  const [month, setMonth] = useState(currentDate[1]);
  const [day, setDay] = useState(currentDate[2]);
  const [selectDate, setSelectDate] = useState<string>(
    `${String(year)}-${String(month)}-${currentDate[2]}`
  );
  const [days, setDays] = useState(Days_Option_Generater(year, month));
  const [onCalendar, setOnCalendar] = useState(false);
  const multi_dup_check =
    handler.GetPageVal("cal_state") === "multi"
      ? useRecoilValue(duplicationDateCheck)
      : undefined;

  const max_year = max_date ? max_date.split("-")[0] : currentDate[0];
  const min_year = min_date ? min_date.split("-")[0] : 1980;
  const max_month = max_date ? max_date?.split("-")[1] : currentDate[1];
  const min_month = min_date ? min_date?.split("-")[1] : 1;
  const years: any = Year_Option_Generater(
    max_date ? Number(max_year) - Number(min_year) + 1 : 44
  );

  const month_list =
    Number(max_year) === year
      ? new Array(Number(max_month)).fill(1).map((_, idx) => {
          return idx + 1;
        })
      : Number(min_year) === year
      ? min_month_arr(min_month)
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const onClickDirection = (dir: "+" | "-") => {
    if (dir === "+") {
      setMonth((prev) => {
        if (prev === 12) {
          return 1;
        }
        return prev + 1;
      });
      if (month === 12) {
        setYear((prev) => prev + 1);
      }
    }
    if (dir === "-") {
      setMonth((prev) => {
        if (prev === 1) {
          return 12;
        }
        return prev - 1;
      });
      if (month === 1) {
        setYear((prev) => prev - 1);
      }
    }
  };

  const SelectCallback = (params: string, value: string | number) => {
    if (params === "year") {
      setDays(Days_Option_Generater(Number(value), month));
      setYear(Number(value));
    } else {
      setDays(Days_Option_Generater(year, Number(value)));
      setMonth(Number(value));
    }
  };
  return (
    <>
      {onCalendar && (
        <>
          <div className="modal_background" onClick={() => {}}></div>
          <div className="calendar_container">
            <div className="date_input_container">
              <div className="date_input_header">
                {year}년 {month}월 {day} 일
              </div>
              <div id="date_input_controllbar">
                <button
                  id="date_prev_btn"
                  onClick={() => {
                    if (
                      Number(min_year) === year &&
                      Number(min_month) === month
                    ) {
                      setYear(Number(max_year));
                      setMonth(Number(max_month));
                      setDay(currentDate[2]);
                      setDays(
                        Days_Option_Generater(
                          Number(max_year),
                          Number(max_month)
                        )
                      );
                    } else {
                      onClickDirection("-");
                      setDays(Days_Option_Generater(year, month - 1));
                    }
                  }}
                >
                  <img src={IMGRedDirection} alt="Date Prev Button" />
                </button>
                <div id="date_select_box">
                  <SelectInput
                    type="date_normal"
                    options={[0, ...years]}
                    params="year"
                    callBack={SelectCallback}
                    defaultSelect={year}
                    selected={year}
                  />
                  <SelectInput
                    type="date_normal"
                    options={[0, ...month_list]}
                    params="month"
                    callBack={SelectCallback}
                    defaultSelect={month}
                    selected={month}
                  />
                </div>
                <button
                  id="date_next_btn"
                  onClick={() => {
                    if (
                      Number(max_year) === year &&
                      Number(max_month) === month
                    ) {
                      setYear(Number(min_year));
                      setMonth(Number(min_month));
                      setDay(currentDate[2]);
                      setDays(
                        Days_Option_Generater(
                          Number(min_year),
                          Number(min_month)
                        )
                      );
                    } else {
                      onClickDirection("+");
                      setDays(Days_Option_Generater(year, month + 1));
                    }
                  }}
                >
                  <img src={IMGRedDirection} alt="Date Next Button" />
                </button>
              </div>
              <div className="date_input_days fs_16">
                <div>일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div>토</div>
              </div>
              <div className="date_input_dates">
                {days.map((el: string, idx: number) => {
                  return (
                    <div
                      className={` ${
                        (params === "retiredDay" || params === "enterDay") &&
                        multi_dup_check &&
                        multi_dup_check.includes(
                          `${String(year)}-${String(month)}-${el}`
                        )
                          ? "unset_dates"
                          : ""
                      } ${
                        selectDate === `${String(year)}-${String(month)}-${el}`
                          ? "select"
                          : ""
                      }`}
                      key={String(el + Date.now()) + idx + Date.now()}
                      onClick={() => {
                        if (!el) return;
                        setDay(Number(el));
                        setSelectDate(`${String(year)}-${String(month)}-${el}`);
                      }}
                    >
                      <div>{el}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="calendar_button_container">
              <Button
                text={"취소"}
                type="date_cancel"
                click_func={() => {
                  setOnCalendar(false);
                }}
              />
              <Button
                text={"선택"}
                type="date_select"
                click_func={() => {
                  if (time_select) {
                    setOnCalendar(false);
                    CreatePopup(
                      "이 날 근무한 시간을 선택해주세요.",
                      <PopupSelect
                        options={[
                          "8시간 이상",
                          "7시간",
                          "6시간",
                          "5시간",
                          "4시간 이하",
                        ]}
                        callBack={handler.SetPageVal}
                        params="popup_select"
                        popup_select={handler.GetPageVal}
                        select_params="dayWorkTime"
                      />,
                      "confirm",
                      () => {
                        handler.SetPageVal(
                          "dayWorkTime",
                          [
                            "8시간 이상",
                            "7시간",
                            "6시간",
                            "5시간",
                            "4시간 이하",
                          ][
                            handler.GetPageVal("popup_select") === undefined
                              ? 0
                              : handler.GetPageVal("popup_select")
                          ]
                        );
                        setDate(
                          `${Format_Korean_Date(`${year}-${month}-${day}`)} / ${
                            [
                              "8시간 이상",
                              "7시간",
                              "6시간",
                              "5시간",
                              "4시간 이하",
                            ][
                              handler.GetPageVal("popup_select") === undefined
                                ? 0
                                : handler.GetPageVal("popup_select")
                            ]
                          }`
                        );
                        handler &&
                          handler.SetPageVal(params, `${year}-${month}-${day}`);
                        ClosePopup();
                      },
                      () => {},
                      "선택",
                      "취소"
                    );
                  } else {
                    setDate(Format_Korean_Date(`${year}-${month}-${day}`));
                    handler &&
                      handler.SetPageVal(params, `${year}-${month}-${day}`);
                    setOnCalendar(false);
                  }
                }}
              />
            </div>
          </div>
        </>
      )}
      <div
        className="w_100"
        onClick={() => {
          if (alarm) {
            CreatePopup(undefined, alarm, "only_check", () => {
              ClosePopup();
              setOnCalendar(true);
            });
          } else {
            setOnCalendar(true);
          }
        }}
      >
        {label && <label className="write_label fs_16">{label}</label>}
        <div className={`date_container ${!date ? "unselect" : ""}`}>
          <div className={`date_value fs_14 ${!date ? "unselect" : ""}`}>
            {!date
              ? placeholder
                ? placeholder
                : "날짜를 선택해주세요."
              : date}
          </div>
          <div className={`date_icon ${!date ? "unselect" : ""}`}>
            <img src={IMGDate} alt="Date Icon" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;

import {
  Dispatch,
  MouseEvent,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import IMGDate from "../../assets/image/date_icon.svg";
import IMGRedDirection from "../../assets/image/red_direction.svg";
import SelectInput from "./Select";
import InputHandler from "../../object/Inputs";
import { GetDateArr, Year_Option_Generater } from "../../utils/date";
import { ClosePopup, CreatePopup } from "../common/Popup";
import "../../styles/date.css";

const currentDate = GetDateArr(null);

class DateHandler extends InputHandler {
  public setYear: Dispatch<SetStateAction<number>> | undefined = undefined;
  public setMonth: Dispatch<SetStateAction<number>> | undefined = undefined;
  public setDay: Dispatch<SetStateAction<number>> | undefined = undefined;
  public setDays: Dispatch<SetStateAction<number[]>> | undefined = undefined;
  public setDateValue: Dispatch<SetStateAction<string>> | undefined = undefined;
  public refNext: any = undefined;
  public refPrev: any = undefined;
  public current_year_list = Year_Option_Generater(44);
  public plan_todo_data = [];

  SelectCallback = (params: string, value: number) => {
    this.SetPageVal(params, Number(value));
    if (params === "year") {
      this.setYear && this.setYear(value);
    }
    if (params === "month") {
      this.setMonth && this.setMonth(value);
    }
    this.setDays &&
      this.setDays(
        this.Days_Option_Generater(
          Number(this._Data["year"]),
          this._Data["month"]
        )
      );
  };

  SelectDateNextClick = () => {
    const minYear = Number(
      this.current_year_list[this.current_year_list.length - 1]
    );
    this.setMonth &&
      this.setMonth((prev) => {
        if (prev === 12) {
          this.setYear &&
            this.setYear((prev) => {
              if (prev === Number(this.current_year_list[0])) {
                return minYear;
              } else {
                return Number(prev) + 1;
              }
            });
          return 1;
        } else {
          return Number(prev) + 1;
        }
      });
  };

  SelectDatePrevClick = () => {
    const minYear = Number(
      this.current_year_list[this.current_year_list.length - 1]
    );
    this.setMonth &&
      this.setMonth((prev) => {
        if (prev === 1) {
          this.setYear &&
            this.setYear((prev) => {
              if (prev === minYear) {
                return Number(this.current_year_list[0]);
              } else {
                return Number(prev) - 1;
              }
            });
          return 12;
        } else {
          return Number(prev) - 1;
        }
      });
  };

  Days_Option_Generater = (year: number, month: number) => {
    const days_arr = new Array(new Date(year, month - 1, 1).getDay()).fill("");
    const days_count = new Date(year, month, 0).getDate();
    for (let i = 0; i < days_count; i++) {
      days_arr.push(String(i + 1));
    }
    return days_arr;
  };

  Action_Get_Date = (
    callBack?: CallableFunction,
    setValueState?: Dispatch<SetStateAction<string>>,
    params?: string
  ) => {
    const viewDate = `${this._Data.year ? this._Data.year : currentDate[0]}-${
      this._Data.month ? this._Data.month : currentDate[1]
    }-${this._Data.day ? this._Data.day : currentDate[2]}`;
    const mostWorkRecentDay =
      this._Data.plan_todo_data && this._Data.plan_todo_data.length > 0
        ? this._Data.plan_todo_data?.reduce((prev: any, curr: any) => {
            return new Date(prev).getTime() <= new Date(curr).getTime()
              ? curr
              : prev;
          })
        : this._Data.plan_todo_data;
    if (params === "isOverTen") {
      callBack &&
        callBack(params, this._Data.plan_todo_data.length >= 10 ? true : false);
      callBack &&
        callBack(
          "hasWork",
          Math.ceil(
            Math.abs(
              new Date(viewDate).getTime() -
                new Date(mostWorkRecentDay).getTime()
            ) /
              (1000 * 3600 * 24)
          ) <= 14
            ? true
            : false
        );
      setValueState &&
        setValueState(
          this._Data.plan_todo_data.length >= 10
            ? "10일 이상 근무"
            : "10일 이하 근무"
        );
    } else {
      callBack && callBack(params, viewDate);
      setValueState && setValueState(viewDate);
    }
  };
}

const _DaysComp = ({
  handler,
  planToDo,
  planToDoYear,
  planToDoMonth,
  currentSelectDay,
}: {
  handler: any;
  planToDo: string;
  planToDoYear: string;
  planToDoMonth: string;
  currentSelectDay: number;
}) => {
  const [selectedDate, setSelectedDate] = useState<any>(
    planToDo
      ? handler.GetPageVal("plan_todo_data")
        ? handler.GetPageVal("plan_todo_data")
        : []
      : currentSelectDay
      ? currentSelectDay
      : currentDate[2]
  );
  const [days, setDays] = useState(
    handler.Days_Option_Generater(
      planToDo ? planToDo[0] : currentDate[0],
      planToDo ? planToDo[1] : currentDate[1]
    )
  );
  useEffect(() => {
    handler.setDays = setDays;
  }, []);
  return (
    <div className="date_input_dates">
      {days?.map((el: string, idx: number) => {
        return (
          <div
            key={String(el + Date.now()) + idx}
            onClick={() => {
              if (!el) return;
              if (planToDo) {
                if (selectedDate.includes(el)) {
                  const delete_arr = [...selectedDate];
                  const delete_num = delete_arr.indexOf(el);
                  delete_arr.splice(delete_num, 1);
                  setSelectedDate(delete_arr);
                }
                selectedDate.push(`${planToDoYear}-${planToDoMonth}-${el}`);
                setSelectedDate([...selectedDate]);
                handler.SetPageVal(
                  "plan_todo_data",
                  selectedDate.map((el: string) => {
                    return el;
                  })
                );
              } else {
                setSelectedDate(Number(el));
                handler.setDay(Number(el));
                handler.SetPageVal("day", el);
              }
            }}
            className={`fs_16 ${
              Number(el) === selectedDate ||
              (Array.isArray(selectedDate) &&
                selectedDate.includes(`${planToDoYear}-${planToDoMonth}-${el}`))
                ? "select"
                : ""
            }`}
          >
            {Number(el) === selectedDate ||
            (Array.isArray(selectedDate) &&
              selectedDate.includes(
                `${planToDoYear}-${planToDoMonth}-${el}`
              )) ? (
              <div className="select_box fs_16">{el}</div>
            ) : (
              el
            )}
          </div>
        );
      })}
    </div>
  );
};

const _DatePopUp = ({
  handler,
  years,
  planToDo,
  max_date,
  min_date,
}: {
  handler: any;
  years: any[];
  planToDo?: any;
  max_date?: any;
  min_date?: any;
}) => {
  const currentSelectDate = [
    handler.GetPageVal("year"),
    handler.GetPageVal("month"),
    Number(handler.GetPageVal("day")),
  ];
  const planTodo = planToDo && GetDateArr(planToDo("planToDo"));
  const [planToDoButton, setState] = useState(false);
  const [planToDoYear, setPlanToDoYear] = useState(planTodo && planTodo[0]);
  const [planToDoMonth, setPlanToDoMonth] = useState(planTodo && planTodo[1]);
  const refNext: any = useRef(null);
  const refPrev: any = useRef(null);
  const [year, setYear] = useState(
    planTodo
      ? planTodo[0]
      : currentSelectDate[0]
      ? currentSelectDate[0]
      : currentDate[0]
  );
  const [month, setMonth] = useState(
    planTodo
      ? planTodo[1]
      : currentSelectDate[1]
      ? currentSelectDate[1]
      : currentDate[1]
  );
  const [day, setDay] = useState(planTodo ? planTodo[2] : currentDate[2]);
  useEffect(() => {
    handler.setYear = setYear;
    handler.setMonth = setMonth;
    handler.setDay = setDay;
    handler.refNext = refNext;
    handler.refPrev = refPrev;
  }, []);
  return (
    <div className="date_input_container">
      <div className="date_input_header">
        {year}년 {month}월 {!planTodo ? `${day} 일` : ""}
      </div>
      <div id="date_input_controllbar">
        <button
          id="date_prev_btn"
          ref={refPrev}
          className={planToDo ? (planToDoButton ? "acitve" : "") : ""}
          onClick={() => {
            if (planToDo) {
              handler.setDays(
                handler.Days_Option_Generater(planTodo[0], planTodo[0] - 1)
              );
              setState(true);
              if (planToDoMonth === 1) {
                setPlanToDoYear((prev: number) => prev - 1);
              }
              setPlanToDoMonth((prev: number) => {
                if (prev === 1) {
                  return 12;
                }
                return prev - 1;
              });
            } else {
              handler.SetPageVal("year", year);
              handler.SetPageVal("month", month + 1);
              handler.SetPageVal("day", day);
              handler.setDays(handler.Days_Option_Generater(year, month));
              handler.SelectDatePrevClick();
            }
          }}
        >
          <img src={IMGRedDirection} alt="Date Prev Button" />
        </button>
        <div id="date_select_box">
          {planToDo ? (
            <div>
              {planToDoYear}년 {planToDoMonth}월
            </div>
          ) : (
            <>
              <SelectInput
                type="date_normal"
                options={[0, ...years]}
                params="year"
                callBack={handler.SelectCallback}
                defaultSelect={year}
              />
              <SelectInput
                type="date_normal"
                options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                params="month"
                callBack={handler.SelectCallback}
                defaultSelect={month}
              />
            </>
          )}
        </div>
        <button
          id="date_next_btn"
          ref={refNext}
          className={planToDo ? (!planToDoButton ? "acitve" : "") : ""}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            handler.setDays([1, 1]);
            if (planToDo) {
              setState(false);
              handler.setDays(
                handler.Days_Option_Generater(planTodo[0], planTodo[0])
              );
              if (planToDoMonth === 12) {
                setPlanToDoYear((prev: number) => prev + 1);
              }
              setPlanToDoMonth((prev: number) => {
                if (prev === 12) {
                  return 1;
                }
                return prev + 1;
              });
            } else {
              handler.SetPageVal("year", year);
              handler.SetPageVal("month", month + 1);
              handler.SetPageVal("day", day);
              handler.setDays(handler.Days_Option_Generater(year, month));
              handler.SelectDateNextClick();
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
      <_DaysComp
        handler={handler}
        planToDo={planTodo}
        planToDoYear={planToDoYear}
        planToDoMonth={planToDoMonth}
        currentSelectDay={currentSelectDate[2]}
      />
    </div>
  );
};

export const DateInputNormal = ({
  params,
  label,
  planToDo,
  description,
  year,
  placeholder,
  callBack,
  selected,
  isReset,
  alarm_comment,
  max_date,
  min_date,
}: {
  params: string;
  label?: string;
  planToDo?: any;
  description?: string | "enter_day" | "insurance_end_day" | "self-employment";
  year?: any;
  placeholder?: string;
  callBack?: CallableFunction | undefined;
  selected?: string;
  isReset?: boolean;
  alarm_comment?: string | ReactElement;
  max_date?: string;
  min_date?: string;
}) => {
  const handler = new DateHandler({});
  const [dateValue, setDateValue] = useState(
    isReset ? "" : selected ? selected : ""
  );
  useEffect(() => {
    !handler.GetPageVal("year") && handler.SetPageVal("year", currentDate[0]);
    !handler.GetPageVal("month") && handler.SetPageVal("month", currentDate[1]);
    handler.setDateValue = setDateValue;
  });

  const createPopupDate = () => {
    CreatePopup(
      "",
      <_DatePopUp
        handler={handler}
        planToDo={planToDo}
        years={year ? year : handler.current_year_list}
        max_date={max_date}
        min_date={min_date}
      />,
      "date",
      () => {
        if (params === "isOverTen") {
          if (handler._Data.plan_todo_data === undefined) {
            CreatePopup(
              undefined,
              "최근 근로일을 1일 이상 선택하세요.",
              "only_check",
              () => {},
              () => {},
              "확인"
            );
          } else {
            handler.Action_Get_Date(callBack && callBack, setDateValue, params);
            ClosePopup();
          }
        } else {
          handler.Action_Get_Date(callBack && callBack, setDateValue, params);
          ClosePopup();
        }
      },
      undefined,
      "선택",
      "취소"
    );
  };
  const popupDate = () => {
    if (alarm_comment) {
      CreatePopup(
        undefined,
        alarm_comment,
        "only_check",
        () => {
          createPopupDate();
        },
        undefined,
        "확인"
      );
    } else {
      createPopupDate();
    }
  };
  const onClickDateOn = () => {
    if (planToDo) {
      if (!planToDo("planToDo")) {
        CreatePopup(
          undefined,
          "신청 예정일을 선택한 후 입력가능합니다.",
          "only_check"
        );
        return;
      } else {
        popupDate();
      }
    } else {
      popupDate();
    }
  };
  return (
    <>
      <div className="w_100">
        {label && <label className="write_label fs_16">{label}</label>}
        <div
          onClick={onClickDateOn}
          className={`date_container ${!dateValue ? "unselect" : ""}`}
        >
          <div className={`date_value fs_14 ${!dateValue ? "unselect" : ""}`}>
            {!dateValue
              ? placeholder
                ? placeholder
                : "날짜를 선택해주세요."
              : dateValue}
          </div>
          <div className={`date_icon ${!dateValue ? "unselect" : ""}`}>
            <img src={IMGDate} alt="Date Icon" />
          </div>
        </div>
      </div>
    </>
  );
};

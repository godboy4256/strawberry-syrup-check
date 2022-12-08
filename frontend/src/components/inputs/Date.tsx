import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import IMGDate from "../../assets/image/date_icon.svg";
import IMGRedDirection from "../../assets/image/red_direction.svg";
import IMGPrev from "../../assets/image/new/i_date_prev.svg";
import IMGNext from "../../assets/image/new/i_date_next.svg";
import SelectInput from "./Select";
import InputHandler from "../../object/Inputs";
import {
  GetDateArr,
  Month_Calculator,
  Year_Option_Generater,
} from "../../utils/date";
import "../../styles/date.css";
import { CreatePopup } from "../common/Popup";

const currentDate = GetDateArr(null);

class DateHandler extends InputHandler {
  public setYear: Dispatch<SetStateAction<number>> | undefined = undefined;
  public setMonth: Dispatch<SetStateAction<number>> | undefined = undefined;
  public setDay: Dispatch<SetStateAction<number>> | undefined = undefined;
  public setDays: Dispatch<SetStateAction<number[]>> | undefined = undefined;

  public current_year_list = Year_Option_Generater(10);
  public plan_todo_data = [];

  SelectCallback = (params: string, value: string) => {
    this.SetPageVal(params, value);
    if (params === "year") {
      this.setDays &&
        this.setDays(this.Days_Option_Generater(Number(value), currentDate[1]));
      this.setYear && this.setYear(Number(value));
    } else if (params === "month") {
      this.setDays &&
        this.setDays(this.Days_Option_Generater(currentDate[0], Number(value)));
      this.setMonth && this.setMonth(Number(value));
    }
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
                return prev + 1;
              }
            });
          return 1;
        } else {
          return prev + 1;
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
                return prev - 1;
              }
            });
          return 12;
        } else {
          return prev - 1;
        }
      });
  };

  Days_Option_Generater = (year: number, month: number) => {
    const days_arr = new Array(new Date(year, month, 1).getDay()).fill("");
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
    if (params === "isOverTen") {
      callBack &&
        callBack(params, this.plan_todo_data.length >= 10 ? true : false);
      callBack &&
        callBack("hasWork", [
          this.plan_todo_data.length >= 14 ? true : false,
          this.plan_todo_data.reduce((prev, curr) => {
            return new Date(prev).getTime() <= new Date(curr).getTime()
              ? curr
              : prev;
          }),
        ]);
    } else {
      callBack && callBack(params, viewDate);
      setValueState && setValueState(viewDate);
    }
  };
}

const _DaysComp = ({
  handler,
  planToDo,
}: {
  handler: any;
  planToDo: string;
}) => {
  const [selectedDate, setSelectedDate] = useState<any>(
    planToDo ? [] : currentDate[2]
  );
  const [days, setDays] = useState(
    handler.Days_Option_Generater(currentDate[0], currentDate[1])
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
                setSelectedDate([...selectedDate, el]);
                handler.plan_todo_data = selectedDate.map((el: string) => {
                  return `${planToDo[0]}-${planToDo[1]}-${el}`;
                });
              } else {
                setSelectedDate(Number(el));
                handler.setDay(Number(el));
                handler.SetPageVal("day", el);
              }
            }}
            className={`fs_16 ${
              Number(el) === selectedDate ||
              (Array.isArray(selectedDate) && selectedDate.includes(el))
                ? "select"
                : ""
            }`}
          >
            {Number(el) === selectedDate ||
            (Array.isArray(selectedDate) && selectedDate.includes(el)) ? (
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

const _DateHeader = ({
  handler,
  planTodo,
}: {
  handler: any;
  planTodo: string;
}) => {
  const [year, setYear] = useState(planTodo ? planTodo[0] : currentDate[0]);
  const [month, setMonth] = useState(planTodo ? planTodo[1] : currentDate[1]);
  const [day, setDay] = useState(planTodo ? planTodo[2] : currentDate[2]);
  useEffect(() => {
    handler.setYear = setYear;
    handler.setMonth = setMonth;
    handler.setDay = setDay;
  }, []);
  return (
    <div className="date_input_header">
      {year}년 {month}월 {!planTodo ? `${day} 일` : ""}
    </div>
  );
};

const _DatePopUp = ({
  handler,
  year,
  planToDo,
}: {
  handler: any;
  year: any[];
  planToDo?: any;
}) => {
  const planTodo = planToDo && GetDateArr(planToDo("planToDo"));
  const [planToDoButton, setState] = useState(false);
  const [planToDoYear, setPlanToDoYear] = useState(planTodo && planTodo[0]);
  const [planToDoMonth, setPlanToDoMonth] = useState(planTodo && planTodo[1]);
  return (
    <div className="date_input_container">
      <_DateHeader handler={handler} planTodo={planTodo} />
      <div id="date_input_controllbar">
        <button
          id="date_prev_btn"
          className={planToDo ? (planToDoButton ? "acitve" : "") : ""}
          onClick={() => {
            if (planToDo) {
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
            }
            handler.SelectDatePrevClick();
            handler.setDays(
              handler.Days_Option_Generater(planToDoYear, planToDoMonth)
            );
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
                selected={currentDate[0]}
                type="date_normal"
                options={year}
                params="year"
                callBack={handler.SelectCallback}
              />
              <SelectInput
                selected={currentDate[1]}
                type="date_normal"
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                params="month"
                callBack={handler.SelectCallback}
              />
            </>
          )}
        </div>
        <button
          id="date_next_btn"
          className={planToDo ? (!planToDoButton ? "acitve" : "") : ""}
          onClick={() => {
            if (planToDo) {
              setState(false);
              if (planToDoMonth === 12) {
                setPlanToDoYear((prev: number) => prev + 1);
              }
              setPlanToDoMonth((prev: number) => {
                if (prev === 12) {
                  return 1;
                }
                return prev + 1;
              });
            }
            handler.SelectDateNextClick();
            handler.setDays(
              handler.Days_Option_Generater(planToDoYear, planToDoMonth)
            );
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
      <_DaysComp handler={handler} planToDo={planTodo} />
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
}: {
  params?: string;
  label?: string;
  planToDo?: any;
  description?: string | "enter_day" | "insurance_end_day" | "self-employment";
  year?: any;
  placeholder?: string;
  callBack?: CallableFunction | undefined;
}) => {
  const handler = new DateHandler({});
  const [dateValue, setDateValue] = useState("");
  const onClickDateOn = () => {
    CreatePopup(
      undefined,
      <_DatePopUp
        handler={handler}
        planToDo={planToDo}
        year={year ? year : handler.current_year_list}
      />,
      "date",
      () => handler.Action_Get_Date(callBack && callBack, setDateValue, params)
    );
  };
  return (
    <>
      <div className="w_100">
        {label && <label className="write_label fs_16">{label}</label>}
        <div
          onClick={onClickDateOn}
          className={`date_container ${!dateValue ? "unselect" : ""}`}
        >
          <div className={`date_value ${!dateValue ? "unselect" : ""}`}>
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
      {description && (
        <div className="date_description">
          <span className="fs_10">※</span>
          {description === "enter_day" ? (
            <span className="fs_10">
              고용보험 가입일이 입·퇴사일과 다르다면,
              <br />
              <span className="font_color_main fs_10">고용보험 가입일</span>을
              기재해주세요.
            </span>
          ) : description === "insurance_end_day" ? (
            <span className="fs_10">
              업무시작일이 아닌
              <span className="font_color_main fs_10"> 고용보험 가입일</span>을
              기재해주세요.
            </span>
          ) : description === "self-employment" ? (
            <span className="fs_10">
              개업, 폐업일이 아닌
              <span className="font_color_main fs_10"> 고용보험 가입일</span>을
              기재해주세요.
            </span>
          ) : (
            <span className="fs_14">{description}</span>
          )}
        </div>
      )}
    </>
  );
};

const _IndiviualInput = ({
  callBack,
  params,
  total,
}: {
  callBack: CallableFunction;
  params: string;
  total?: boolean;
}) => {
  const indiviual_export_data: any = { month: Number(params) };
  const onChangeInput = (params_in: string, value: any) => {
    indiviual_export_data[params_in] = Number(value);
    callBack(params, indiviual_export_data);
  };
  return (
    <div className="indiviual_input_container fs_14">
      <input
        className={total ? "total" : ""}
        placeholder="근로일수"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChangeInput("day", e.currentTarget.value)
        }
      />
      <input
        className={total ? "total" : ""}
        placeholder="월 임금총액"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChangeInput("pay", e.currentTarget.value)
        }
      />
    </div>
  );
};

export const DateInputIndividual = ({
  handler,
  lastWorkDay,
  type,
}: {
  handler: any;
  lastWorkDay: Date;
  type: number;
}) => {
  const [direction, setDirection] = useState(1);
  const lastMonth = GetDateArr(lastWorkDay)[1];
  const month_arr = Month_Calculator(lastMonth, "before", 12);
  const month_arr_splice = month_arr.splice(-2).concat(month_arr);
  return (
    <>
      {type === 3 || type === 4 ? (
        <>
          <div className="date_indiviual_page type_2">
            <div>
              <div className="indiviual_input_header">
                {month_arr_splice[5]} 월
              </div>
              <_IndiviualInput
                callBack={handler.SetPageVal}
                params={`${month_arr_splice[5]}`}
              />
            </div>
            <div>
              <div className="indiviual_input_header">
                {month_arr_splice[4]} 월
              </div>
              <_IndiviualInput
                callBack={handler.SetPageVal}
                params={`${month_arr_splice[4]}`}
              />
            </div>
            <div>
              <div className="indiviual_input_header">
                {month_arr_splice[3]} 월
              </div>
              <_IndiviualInput
                callBack={handler.SetPageVal}
                params={`${month_arr_splice[3]}`}
              />
            </div>
            <div>
              <div className="indiviual_input_header">
                {month_arr_splice[2]} 월
              </div>
              <_IndiviualInput
                callBack={handler.SetPageVal}
                params={`${month_arr_splice[2]}`}
              />
            </div>
            <div>
              <div className="indiviual_input_header">
                {month_arr_splice[1]} 월
              </div>
              <_IndiviualInput
                callBack={handler.SetPageVal}
                params={`${month_arr_splice[1]}`}
              />
            </div>
            <div>
              <div className="indiviual_input_header">
                {month_arr_splice[0]} 월
              </div>
              <_IndiviualInput
                callBack={handler.SetPageVal}
                params={`${month_arr_splice[0]}`}
              />
            </div>
          </div>
        </>
      ) : (
        type === 2 && (
          <div className="date_indiviual_container">
            {direction === 1 ? (
              <>
                <button
                  className="date_indiviual_prev"
                  onClick={() => setDirection(2)}
                >
                  <img src={IMGPrev} alt="prev button" />
                </button>
                <div className="date_indiviual_page">
                  <div>
                    <div className="indiviual_input_header total">
                      {month_arr_splice[3]}월
                    </div>
                    <_IndiviualInput
                      total={true}
                      callBack={handler.SetPageVal}
                      params={`${month_arr_splice[3]}`}
                    />
                  </div>
                  <div>
                    <div className="indiviual_input_header total">
                      {month_arr_splice[2]}월
                    </div>
                    <_IndiviualInput
                      total={true}
                      callBack={handler.SetPageVal}
                      params={`${month_arr_splice[2]}`}
                    />
                  </div>
                  <div className="unset_indiviual_input">
                    <div className="indiviual_input_header">
                      {month_arr_splice[1]}월
                    </div>
                    <div className="unset_box">UnSet</div>
                    <div className="unset_box">UnSet</div>
                  </div>
                  <div className="unset_indiviual_input">
                    <div className="indiviual_input_header">
                      {month_arr_splice[0]}월
                    </div>
                    <div className="unset_box">UnSet</div>
                    <div className="unset_box">UnSet</div>
                  </div>
                </div>
              </>
            ) : direction === 2 ? (
              <>
                <button
                  className="date_indiviual_next"
                  onClick={() => setDirection(1)}
                >
                  <img src={IMGNext} alt="next button" />
                </button>
                <div className="date_indiviual_page">
                  <div>
                    <div className="indiviual_input_header">
                      {month_arr_splice[7]} 월
                    </div>
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params={`${month_arr_splice[7]}`}
                    />
                  </div>
                  <div>
                    <div className="indiviual_input_header">
                      {month_arr_splice[6]} 월
                    </div>
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params={`${month_arr_splice[6]}`}
                    />
                  </div>
                  <div>
                    <div className="indiviual_input_header">
                      {month_arr_splice[5]} 월
                    </div>
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params={`${month_arr_splice[5]}`}
                    />
                  </div>
                  <div>
                    <div className="indiviual_input_header total">
                      {month_arr_splice[4]} 월
                    </div>
                    <_IndiviualInput
                      total={true}
                      callBack={handler.SetPageVal}
                      params={`${month_arr_splice[2]}`}
                    />
                  </div>
                </div>
                <button
                  className="date_indiviual_prev"
                  onClick={() => setDirection(3)}
                >
                  <img src={IMGPrev} alt="prev button" />
                </button>
              </>
            ) : (
              direction === 3 && (
                <>
                  <div className="date_indiviual_page">
                    <div>
                      <div className="indiviual_input_header">
                        {month_arr_splice[11]} 월
                      </div>
                      <_IndiviualInput
                        callBack={handler.SetPageVal}
                        params={`${month_arr_splice[11]}`}
                      />
                    </div>
                    <div>
                      <div className="indiviual_input_header">
                        {month_arr_splice[10]} 월
                      </div>
                      <_IndiviualInput
                        callBack={handler.SetPageVal}
                        params={`${month_arr_splice[10]}`}
                      />
                    </div>
                    <div>
                      <div className="indiviual_input_header">
                        {month_arr_splice[9]} 월
                      </div>
                      <_IndiviualInput
                        callBack={handler.SetPageVal}
                        params={`${month_arr_splice[9]}`}
                      />
                    </div>
                    <div>
                      <div className="indiviual_input_header">
                        {month_arr_splice[8]} 월
                      </div>
                      <_IndiviualInput
                        callBack={handler.SetPageVal}
                        params={`${month_arr_splice[8]}`}
                      />
                    </div>
                  </div>
                  <button
                    className="date_indiviual_next"
                    onClick={() => setDirection(2)}
                  >
                    <img src={IMGNext} alt="next button" />
                  </button>
                </>
              )
            )}
          </div>
        )
      )}
    </>
  );
};

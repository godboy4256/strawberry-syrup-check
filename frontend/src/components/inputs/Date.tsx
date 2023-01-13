import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
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
import { ClosePopup, CreatePopup } from "../common/Popup";
import "../../styles/date.css";

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
}: {
  handler: any;
  planToDo: string;
  planToDoYear: string;
  planToDoMonth: string;
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
              console.log(`${planToDoYear}-${planToDoMonth}-${el}`);
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
            console.log(2);
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
            // handler.setDays(
            //   handler.Days_Option_Generater(planToDoYear, planToDoMonth)
            // );
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
            console.log(1);
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
            // handler.setDays(
            //   handler.Days_Option_Generater(planToDoYear, planToDoMonth)
            // );
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
  const popupDate = () => {
    CreatePopup(
      "",
      <_DatePopUp
        handler={handler}
        planToDo={planToDo}
        year={year ? year : handler.current_year_list}
      />,
      "date",
      () => {
        handler.Action_Get_Date(callBack && callBack, setDateValue, params);
        ClosePopup();
      },
      undefined,
      "선택",
      "취소"
    );
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
  pay = false,
}: {
  callBack: CallableFunction;
  params: string;
  total?: boolean;
  pay?: boolean;
  isDayJob?: boolean;
}) => {
  let indiviual_export_data: any = { month: Number(params) };
  const onChangeInput = (params_in: string, value: any) => {
    indiviual_export_data[params_in] = Number(value);
    callBack(params, indiviual_export_data);
  };
  return (
    <div className="indiviual_input_container fs_14">
      <input
        maxLength={2}
        className={`${total ? "total" : ""} font_color_main`}
        placeholder="근로일수"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChangeInput("day", e.currentTarget.value);
        }}
      />
      {pay && (
        <input
          className={`${total ? "total" : ""} font_color_main`}
          placeholder="월 임금총액"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChangeInput("pay", e.currentTarget.value);
          }}
        />
      )}
    </div>
  );
};

export const DateInputIndividual = ({
  handler,
  lastWorkDay,
  type,
  year,
}: {
  handler: any;
  lastWorkDay: Date;
  type: number;
  year: number | string;
}) => {
  const refIndividualPage: any = useRef<HTMLInputElement>(null);
  const refPrev: any = useRef<HTMLInputElement>(null);
  const refNext: any = useRef<HTMLInputElement>(null);

  const lastMonth = GetDateArr(lastWorkDay)[1];
  const month_arr = Month_Calculator(lastMonth, "before", 12);
  const month_arr_three = [month_arr[0], month_arr[1], month_arr[2]];

  let locationPage = 0;
  let lastYear = String(GetDateArr(lastWorkDay)[0]);
  const oneMonthYear = lastMonth === 1 ? String(Number(lastYear) - 1) : null;

  useEffect(() => {
    if (lastMonth === 1 && oneMonthYear) {
      lastYear = oneMonthYear;
    }
  }, []);

  return (
    <div className="date_indiviual_container">
      {type === 3 || type === 4 ? (
        <div id="date_indiviual_container_short">
          <div ref={refIndividualPage}>
            <div className="date_indiviual_page type_2">
              <div className="br_r">
                <div
                  className={`indiviual_input_header ${
                    lastYear === year && lastMonth < 1 ? "unset_nop" : ""
                  }`}
                >
                  1 월
                </div>
                {lastYear === year ? (
                  lastMonth < 1 ? (
                    <>
                      <div className="unset_box_short">unset</div>
                      <div className="unset_box_short">unset</div>
                    </>
                  ) : (
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params="1"
                      pay={true}
                      isDayJob={true}
                    />
                  )
                ) : (
                  <_IndiviualInput
                    callBack={handler.SetPageVal}
                    params="1"
                    pay={true}
                    isDayJob={true}
                  />
                )}
              </div>
              <div>
                <div
                  className={`indiviual_input_header ${
                    lastYear === year && lastMonth < 2 ? "unset_nop" : ""
                  }`}
                >
                  2 월
                </div>
                {lastYear === year ? (
                  lastMonth < 2 ? (
                    <>
                      <div className="unset_box_short">unset</div>
                      <div className="unset_box_short">unset</div>
                    </>
                  ) : (
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params="2"
                      pay={true}
                      isDayJob={true}
                    />
                  )
                ) : (
                  <_IndiviualInput
                    callBack={handler.SetPageVal}
                    params="2"
                    pay={true}
                    isDayJob={true}
                  />
                )}
              </div>
              <div className="br_r">
                <div
                  className={`indiviual_input_header ${
                    lastYear === year && lastMonth < 3 ? "unset_nop" : ""
                  }`}
                >
                  3 월
                </div>
                {lastYear === year ? (
                  lastMonth < 3 ? (
                    <>
                      <div className="unset_box_short">unset</div>
                      <div className="unset_box_short">unset</div>
                    </>
                  ) : (
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params="3"
                      pay={true}
                      isDayJob={true}
                    />
                  )
                ) : (
                  <_IndiviualInput
                    callBack={handler.SetPageVal}
                    params="3"
                    pay={true}
                    isDayJob={true}
                  />
                )}
              </div>
              <div>
                <div
                  className={`indiviual_input_header ${
                    lastYear === year && lastMonth < 4 ? "unset_nop" : ""
                  }`}
                >
                  4 월
                </div>
                {lastYear === year ? (
                  lastMonth < 4 ? (
                    <>
                      <div className="unset_box_short">unset</div>
                      <div className="unset_box_short">unset</div>
                    </>
                  ) : (
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params="4"
                      pay={true}
                      isDayJob={true}
                    />
                  )
                ) : (
                  <_IndiviualInput
                    callBack={handler.SetPageVal}
                    params="4"
                    pay={true}
                    isDayJob={true}
                  />
                )}
              </div>
              <div className="br_r">
                <div
                  className={`indiviual_input_header ${
                    lastYear === year && lastMonth < 5 ? "unset_nop" : ""
                  }`}
                >
                  5 월
                </div>
                {lastYear === year ? (
                  lastMonth < 5 ? (
                    <>
                      <div className="unset_box_short">unset</div>
                      <div className="unset_box_short">unset</div>
                    </>
                  ) : (
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params="5"
                      pay={true}
                      isDayJob={true}
                    />
                  )
                ) : (
                  <_IndiviualInput
                    callBack={handler.SetPageVal}
                    params="5"
                    pay={true}
                    isDayJob={true}
                  />
                )}
              </div>
              <div>
                <div
                  className={`indiviual_input_header ${
                    lastYear === year && lastMonth < 6 ? "unset_nop" : ""
                  }`}
                >
                  6 월
                </div>
                {lastYear === year ? (
                  lastMonth < 6 ? (
                    <>
                      <div className="unset_box_short">unset</div>
                      <div className="unset_box_short">unset</div>
                    </>
                  ) : (
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params="6"
                      pay={true}
                      isDayJob={true}
                    />
                  )
                ) : (
                  <_IndiviualInput
                    callBack={handler.SetPageVal}
                    params="6"
                    pay={true}
                    isDayJob={true}
                  />
                )}
              </div>
            </div>
            <div className="date_indiviual_page type_2">
              <div className="br_r">
                <div
                  className={`indiviual_input_header ${
                    lastYear === year && lastMonth < 7 ? "unset_nop" : ""
                  }`}
                >
                  7 월
                </div>
                {lastYear === year ? (
                  lastMonth < 7 ? (
                    <>
                      <div className="unset_box_short">unset</div>
                      <div className="unset_box_short">unset</div>
                    </>
                  ) : (
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params="7"
                      pay={true}
                      isDayJob={true}
                    />
                  )
                ) : (
                  <_IndiviualInput
                    callBack={handler.SetPageVal}
                    params="7"
                    pay={true}
                    isDayJob={true}
                  />
                )}
              </div>
              <div>
                <div
                  className={`indiviual_input_header ${
                    lastYear === year && lastMonth < 8 ? "unset_nop" : ""
                  }`}
                >
                  8 월
                </div>
                {lastYear === year ? (
                  lastMonth < 8 ? (
                    <>
                      <div className="unset_box_short">unset</div>
                      <div className="unset_box_short">unset</div>
                    </>
                  ) : (
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params="8"
                      pay={true}
                      isDayJob={true}
                    />
                  )
                ) : (
                  <_IndiviualInput
                    callBack={handler.SetPageVal}
                    params="8"
                    pay={true}
                    isDayJob={true}
                  />
                )}
              </div>
              <div className="br_r">
                <div
                  className={`indiviual_input_header ${
                    lastYear === year && lastMonth < 9 ? "unset_nop" : ""
                  }`}
                >
                  9 월
                </div>
                {lastYear === year ? (
                  lastMonth < 9 ? (
                    <>
                      <div className="unset_box_short">unset</div>
                      <div className="unset_box_short">unset</div>
                    </>
                  ) : (
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params="9"
                      pay={true}
                      isDayJob={true}
                    />
                  )
                ) : (
                  <_IndiviualInput
                    callBack={handler.SetPageVal}
                    params="9"
                    pay={true}
                    isDayJob={true}
                  />
                )}
              </div>
              <div>
                <div
                  className={`indiviual_input_header ${
                    lastYear === year && lastMonth < 10 ? "unset_nop" : ""
                  }`}
                >
                  10 월
                </div>
                {lastYear === year ? (
                  lastMonth < 10 ? (
                    <>
                      <div className="unset_box_short">Unset</div>
                      <div className="unset_box_short">Unset</div>
                    </>
                  ) : (
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params="10"
                      pay={true}
                      isDayJob={true}
                    />
                  )
                ) : (
                  <_IndiviualInput
                    callBack={handler.SetPageVal}
                    params="10"
                    pay={true}
                    isDayJob={true}
                  />
                )}
              </div>
              <div className="br_r">
                <div
                  className={`indiviual_input_header ${
                    lastYear === year && lastMonth < 11 ? "unset_nop" : ""
                  }`}
                >
                  11 월
                </div>
                {lastYear === year ? (
                  lastMonth < 11 ? (
                    <>
                      <div className="unset_box_short">Unset</div>
                      <div className="unset_box_short">Unset</div>
                    </>
                  ) : (
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params="11"
                      pay={true}
                      isDayJob={true}
                    />
                  )
                ) : (
                  <_IndiviualInput
                    callBack={handler.SetPageVal}
                    params="11"
                    pay={true}
                    isDayJob={true}
                  />
                )}
              </div>
              <div>
                <div
                  className={`indiviual_input_header ${
                    lastYear === year && lastMonth < 12 ? "unset_nop" : ""
                  }`}
                >
                  12 월
                </div>
                {lastYear === year ? (
                  lastMonth < 12 ? (
                    <>
                      <div className="unset_box_short">unset</div>
                      <div className="unset_box_short">unset</div>
                    </>
                  ) : (
                    <_IndiviualInput
                      callBack={handler.SetPageVal}
                      params="12"
                      pay={true}
                      isDayJob={true}
                    />
                  )
                ) : (
                  <_IndiviualInput
                    callBack={handler.SetPageVal}
                    params="12"
                    pay={true}
                    isDayJob={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        type === 2 && (
          <div id="date_indiviual_dayjob">
            <div ref={refIndividualPage}>
              <div className="date_indiviual_page">
                <div>
                  <div
                    className={`indiviual_input_header ${
                      lastYear === year && lastMonth < 1
                        ? "unset_header"
                        : lastYear === year && month_arr_three.includes(1)
                        ? "total"
                        : ""
                    }`}
                  >
                    1 월
                  </div>
                  {lastYear === year ? (
                    lastMonth < 1 ? (
                      <>
                        <div className="unset_box">unset</div>
                        <div className="unset_box">unset</div>
                      </>
                    ) : (
                      <_IndiviualInput
                        total={
                          lastYear === year && month_arr_three.includes(1)
                            ? true
                            : false
                        }
                        callBack={handler.SetPageVal}
                        params={"1"}
                        pay={
                          lastYear === year && month_arr_three.includes(1)
                            ? true
                            : false
                        }
                      />
                    )
                  ) : (
                    <_IndiviualInput
                      total={
                        lastYear === year && month_arr_three.includes(1)
                          ? true
                          : false
                      }
                      callBack={handler.SetPageVal}
                      params={"1"}
                      pay={
                        lastYear === year && month_arr_three.includes(1)
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
                <div>
                  <div
                    className={`indiviual_input_header ${
                      lastYear === year && lastMonth < 2
                        ? "unset_header"
                        : lastYear === year && month_arr_three.includes(2)
                        ? "total"
                        : ""
                    }`}
                  >
                    2 월
                  </div>
                  {lastYear === year ? (
                    lastMonth < 2 ? (
                      <>
                        <div className="unset_box">unset</div>
                        <div className="unset_box">unset</div>
                      </>
                    ) : (
                      <_IndiviualInput
                        total={
                          lastYear === year && month_arr_three.includes(2)
                            ? true
                            : false
                        }
                        callBack={handler.SetPageVal}
                        params={"2"}
                        pay={
                          lastYear === year && month_arr_three.includes(2)
                            ? true
                            : false
                        }
                      />
                    )
                  ) : (
                    <_IndiviualInput
                      total={
                        lastYear === year && month_arr_three.includes(2)
                          ? true
                          : false
                      }
                      callBack={handler.SetPageVal}
                      params={"2"}
                      pay={
                        lastYear === year && month_arr_three.includes(2)
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
                <div>
                  <div
                    className={`indiviual_input_header ${
                      lastYear === year && lastMonth < 3
                        ? "unset_header"
                        : lastYear === year && month_arr_three.includes(3)
                        ? "total"
                        : ""
                    }`}
                  >
                    3 월
                  </div>
                  {lastYear === year ? (
                    lastMonth < 3 ? (
                      <>
                        <div className="unset_box">unset</div>
                        <div className="unset_box">unset</div>
                      </>
                    ) : (
                      <_IndiviualInput
                        total={
                          lastYear === year && month_arr_three.includes(3)
                            ? true
                            : false
                        }
                        callBack={handler.SetPageVal}
                        params={"3"}
                        pay={
                          lastYear === year && month_arr_three.includes(3)
                            ? true
                            : false
                        }
                      />
                    )
                  ) : (
                    <_IndiviualInput
                      total={
                        lastYear === year && month_arr_three.includes(3)
                          ? true
                          : false
                      }
                      callBack={handler.SetPageVal}
                      params={"3"}
                      pay={
                        lastYear === year && month_arr_three.includes(3)
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
                <div>
                  <div
                    className={`indiviual_input_header ${
                      lastYear === year && lastMonth < 4
                        ? "unset_header"
                        : lastYear === year && month_arr_three.includes(4)
                        ? "total"
                        : ""
                    }`}
                  >
                    4 월
                  </div>
                  {lastYear === year ? (
                    lastMonth < 4 ? (
                      <>
                        <div className="unset_box">unset</div>
                        <div className="unset_box">unset</div>
                      </>
                    ) : (
                      <_IndiviualInput
                        total={
                          lastYear === year && month_arr_three.includes(4)
                            ? true
                            : false
                        }
                        callBack={handler.SetPageVal}
                        params={"4"}
                        pay={
                          lastYear === year && month_arr_three.includes(4)
                            ? true
                            : false
                        }
                      />
                    )
                  ) : (
                    <_IndiviualInput
                      total={
                        lastYear === year && month_arr_three.includes(4)
                          ? true
                          : false
                      }
                      callBack={handler.SetPageVal}
                      params={"4"}
                      pay={
                        lastYear === year && month_arr_three.includes(4)
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
              </div>
              <div className="date_indiviual_page">
                <div>
                  <div
                    className={`indiviual_input_header ${
                      lastYear === year && lastMonth < 5
                        ? "unset_header"
                        : lastYear === year && month_arr_three.includes(5)
                        ? "total"
                        : ""
                    }`}
                  >
                    5 월
                  </div>
                  {lastYear === year ? (
                    lastMonth < 5 ? (
                      <>
                        <div className="unset_box">unset</div>
                        <div className="unset_box">unset</div>
                      </>
                    ) : (
                      <_IndiviualInput
                        total={
                          lastYear === year && month_arr_three.includes(5)
                            ? true
                            : false
                        }
                        callBack={handler.SetPageVal}
                        params={"5"}
                        pay={
                          lastYear === year && month_arr_three.includes(5)
                            ? true
                            : false
                        }
                      />
                    )
                  ) : (
                    <_IndiviualInput
                      total={
                        lastYear === year && month_arr_three.includes(5)
                          ? true
                          : false
                      }
                      callBack={handler.SetPageVal}
                      params={"5"}
                      pay={
                        lastYear === year && month_arr_three.includes(5)
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
                <div>
                  <div
                    className={`indiviual_input_header ${
                      lastYear === year && lastMonth < 6
                        ? "unset_header"
                        : lastYear === year && month_arr_three.includes(6)
                        ? "total"
                        : ""
                    }`}
                  >
                    6 월
                  </div>
                  {lastYear === year ? (
                    lastMonth < 6 ? (
                      <>
                        <div className="unset_box">unset</div>
                        <div className="unset_box">unset</div>
                      </>
                    ) : (
                      <_IndiviualInput
                        total={
                          lastYear === year && month_arr_three.includes(6)
                            ? true
                            : false
                        }
                        callBack={handler.SetPageVal}
                        params={"6"}
                        pay={
                          lastYear === year && month_arr_three.includes(6)
                            ? true
                            : false
                        }
                      />
                    )
                  ) : (
                    <_IndiviualInput
                      total={
                        lastYear === year && month_arr_three.includes(6)
                          ? true
                          : false
                      }
                      callBack={handler.SetPageVal}
                      params={"6"}
                      pay={
                        lastYear === year && month_arr_three.includes(6)
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
                <div>
                  <div
                    className={`indiviual_input_header ${
                      lastYear === year && lastMonth < 7
                        ? "unset_header"
                        : lastYear === year && month_arr_three.includes(7)
                        ? "total"
                        : ""
                    }`}
                  >
                    7 월
                  </div>
                  {lastYear === year ? (
                    lastMonth < 7 ? (
                      <>
                        <div className="unset_box">unset</div>
                        <div className="unset_box">unset</div>
                      </>
                    ) : (
                      <_IndiviualInput
                        total={
                          lastYear === year && month_arr_three.includes(7)
                            ? true
                            : false
                        }
                        callBack={handler.SetPageVal}
                        params={"7"}
                        pay={
                          lastYear === year && month_arr_three.includes(7)
                            ? true
                            : false
                        }
                      />
                    )
                  ) : (
                    <_IndiviualInput
                      total={
                        lastYear === year && month_arr_three.includes(7)
                          ? true
                          : false
                      }
                      callBack={handler.SetPageVal}
                      params={"7"}
                      pay={
                        lastYear === year && month_arr_three.includes(7)
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
                <div>
                  <div
                    className={`indiviual_input_header ${
                      lastYear === year && lastMonth < 8
                        ? "unset_header"
                        : lastYear === year && month_arr_three.includes(8)
                        ? "total"
                        : ""
                    }`}
                  >
                    8 월
                  </div>
                  {lastYear === year ? (
                    lastMonth < 8 ? (
                      <>
                        <div className="unset_box">unset</div>
                        <div className="unset_box">unset</div>
                      </>
                    ) : (
                      <_IndiviualInput
                        total={
                          lastYear === year && month_arr_three.includes(8)
                            ? true
                            : false
                        }
                        callBack={handler.SetPageVal}
                        params={"8"}
                        pay={
                          lastYear === year && month_arr_three.includes(8)
                            ? true
                            : false
                        }
                      />
                    )
                  ) : (
                    <_IndiviualInput
                      total={
                        lastYear === year && month_arr_three.includes(8)
                          ? true
                          : false
                      }
                      callBack={handler.SetPageVal}
                      params={"8"}
                      pay={
                        lastYear === year && month_arr_three.includes(8)
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
              </div>
              <div className="date_indiviual_page">
                <div>
                  <div
                    className={`indiviual_input_header ${
                      lastYear === year && lastMonth < 9
                        ? "unset_header"
                        : lastYear === year && month_arr_three.includes(9)
                        ? "total"
                        : ""
                    }`}
                  >
                    9 월
                  </div>
                  {lastYear === year ? (
                    lastMonth < 9 ? (
                      <>
                        <div className="unset_box">unset</div>
                        <div className="unset_box">unset</div>
                      </>
                    ) : (
                      <_IndiviualInput
                        total={
                          lastYear === year && month_arr_three.includes(9)
                            ? true
                            : false
                        }
                        callBack={handler.SetPageVal}
                        params={"9"}
                        pay={
                          lastYear === year && month_arr_three.includes(9)
                            ? true
                            : false
                        }
                      />
                    )
                  ) : (
                    <_IndiviualInput
                      total={
                        lastYear === year && month_arr_three.includes(9)
                          ? true
                          : false
                      }
                      callBack={handler.SetPageVal}
                      params={"9"}
                      pay={
                        lastYear === year && month_arr_three.includes(9)
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
                <div>
                  <div
                    className={`indiviual_input_header ${
                      lastYear === year && lastMonth < 10
                        ? "unset_header"
                        : lastYear === year && month_arr_three.includes(10)
                        ? "total"
                        : ""
                    }`}
                  >
                    10 월
                  </div>
                  {lastYear === year ? (
                    lastMonth < 10 ? (
                      <>
                        <div className="unset_box">unset</div>
                        <div className="unset_box">unset</div>
                      </>
                    ) : (
                      <_IndiviualInput
                        total={
                          lastYear === year && month_arr_three.includes(10)
                            ? true
                            : false
                        }
                        callBack={handler.SetPageVal}
                        params={"10"}
                        pay={
                          lastYear === year && month_arr_three.includes(10)
                            ? true
                            : false
                        }
                      />
                    )
                  ) : (
                    <_IndiviualInput
                      total={
                        (lastYear === year && month_arr_three.includes(10)) ||
                        oneMonthYear === year
                          ? true
                          : false
                      }
                      callBack={handler.SetPageVal}
                      params={"10"}
                      pay={
                        (lastYear === year && month_arr_three.includes(10)) ||
                        oneMonthYear === year
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
                <div>
                  <div
                    className={`indiviual_input_header ${
                      lastYear === year && lastMonth < 11
                        ? "unset_header"
                        : lastYear === year && month_arr_three.includes(11)
                        ? "total"
                        : ""
                    }`}
                  >
                    11 월
                  </div>
                  {lastYear === year ? (
                    lastMonth < 11 ? (
                      <>
                        <div className="unset_box">unset</div>
                        <div className="unset_box">unset</div>
                      </>
                    ) : (
                      <_IndiviualInput
                        total={
                          lastYear === year && month_arr_three.includes(11)
                            ? true
                            : false
                        }
                        callBack={handler.SetPageVal}
                        params={"11"}
                        pay={
                          lastYear === year && month_arr_three.includes(11)
                            ? true
                            : false
                        }
                      />
                    )
                  ) : (
                    <_IndiviualInput
                      total={
                        (lastYear === year && month_arr_three.includes(11)) ||
                        oneMonthYear === year
                          ? true
                          : false
                      }
                      callBack={handler.SetPageVal}
                      params={"11"}
                      pay={
                        (lastYear === year && month_arr_three.includes(11)) ||
                        oneMonthYear === year
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
                <div>
                  <div
                    className={`indiviual_input_header ${
                      lastYear === year && lastMonth < 12
                        ? "unset_header"
                        : lastYear === year && month_arr_three.includes(12)
                        ? "total"
                        : ""
                    }`}
                  >
                    12 월
                  </div>
                  {lastYear === year ? (
                    lastMonth < 12 ? (
                      <>
                        <div className="unset_box">unset</div>
                        <div className="unset_box">unset</div>
                      </>
                    ) : (
                      <_IndiviualInput
                        total={
                          lastYear === year && month_arr_three.includes(12)
                            ? true
                            : false
                        }
                        callBack={handler.SetPageVal}
                        params={"12"}
                        pay={
                          lastYear === year && month_arr_three.includes(12)
                            ? true
                            : false
                        }
                      />
                    )
                  ) : (
                    <_IndiviualInput
                      total={
                        (lastYear === year && month_arr_three.includes(12)) ||
                        oneMonthYear === year
                          ? true
                          : false
                      }
                      callBack={handler.SetPageVal}
                      params={"12"}
                      pay={
                        (lastYear === year && month_arr_three.includes(12)) ||
                        oneMonthYear === year
                          ? true
                          : false
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      )}
      <button
        ref={refNext}
        className="date_indiviual_prev"
        onClick={() => {
          if (type === 2) {
            if (locationPage <= 0) {
              return;
            }
          }
          if (type === 3 || type === 4) {
            if (locationPage <= 0) return;
          }
          const currentRef: any = refIndividualPage.current;
          locationPage -= 100;
          currentRef.style.left = `-${locationPage}%`;
        }}
      >
        <img src={IMGPrev} alt="next button" />
      </button>
      <button
        ref={refPrev}
        className="date_indiviual_next"
        onClick={() => {
          if (type === 3 || type === 4) {
            if (locationPage >= 100) return;
          }
          if (locationPage >= 200) {
            return;
          }
          const currentRef: any = refIndividualPage.current;
          locationPage += 100;
          currentRef.style.left = `-${locationPage}%`;
        }}
      >
        <img src={IMGNext} alt="prev button" />
      </button>
    </div>
  );
};

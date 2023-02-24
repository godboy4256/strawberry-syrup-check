import {
  GetDateArr,
  Month_Calculator,
  Year_Option_Generater,
} from "../../utils/date";
import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import IMGPrev from "../../assets/image/new/i_date_prev.svg";
import IMGNext from "../../assets/image/new/i_date_next.svg";
import { ClosePopup, CreatePopup } from "../common/Popup";
import "../../styles/work_record_gen.css";

type WorkRecordGenTypes = {
  label?: string;
  handler: any;
  type: "dayJob" | "shorts";
};

const _PopUpInvidual = ({
  onChangeFunc,
  lastWorkDay,
  year,
  workRecord,
  type,
  workCate,
}: any) => {
  let lastYear = GetDateArr(lastWorkDay)[0],
    locationPage = 0;
  const lastMonth = GetDateArr(lastWorkDay)[1],
    month_arr = Month_Calculator(lastMonth, "before", 12),
    month_arr_three = [month_arr[0], month_arr[1], month_arr[2]],
    year_arr =
      month_arr_three[0] === 1 || month_arr_three[0] === 2
        ? [lastYear - 1, lastYear]
        : [lastYear],
    refIndividualPage = useRef<HTMLInputElement>(null),
    refPrev: any = useRef<HTMLInputElement>(null),
    refNext: any = useRef<HTMLInputElement>(null),
    monthsList =
      type === "dayJob"
        ? [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
          ]
        : [
            [1, 2, 3, 4, 5, 6],
            [7, 8, 9, 10, 11, 12],
          ];

  const isTotal = (month: number) => {
    return year === lastYear
      ? month_arr_three.includes(month)
        ? "total"
        : ""
      : (year === lastYear - 1 && (month === 1 || month === 2)) ||
        (year !== lastYear && year !== lastYear - 1)
      ? ""
      : month_arr_three.includes(month)
      ? "total"
      : "";
  };
  const onChangeInviualInpus = (
    valueAnswer: number,
    target_month: number,
    type: "day" | "pay"
  ) => {
    onChangeFunc(target_month, valueAnswer, type);
  };
  if (workRecord?.months) {
    workRecord?.months?.forEach((el: any) => {
      onChangeFunc(el.month, el.day, "day");
      if (el.pay) {
        onChangeFunc(el.month, el.pay, "pay");
      }
    });
  }
  const monthUnitDefaultValue = (target_month: number) => {
    const target_month_data = workRecord?.months?.filter((el: any) => {
      return el.month === target_month;
    });
    return target_month_data ? target_month_data[0] : null;
  };

  useEffect(() => {
    const currentRef: any = refIndividualPage.current;
    if (lastYear === year) {
      if (type === "dayJob") {
        locationPage = monthsList[0].includes(lastMonth)
          ? 0
          : monthsList[1].includes(lastMonth)
          ? 100
          : monthsList[2].includes(lastMonth)
          ? 200
          : 0;
      } else if (type === "shorts") {
        locationPage = monthsList[0].includes(lastMonth)
          ? 0
          : monthsList[1].includes(lastMonth)
          ? 100
          : 0;
      }
      currentRef.style.left = `-${locationPage}%`;
    }
    if (locationPage === 0) {
      refPrev.current.style.display = "none";
    } else if (locationPage === 200) {
      refNext.current.style.display = "none";
    }
  }, []);

  return (
    <div className="date_indiviual_container">
      <div
        id={
          type === "dayJob" ? "date_indiviual_dayjob" : "date_indiviual_shorts"
        }
      >
        <div ref={refIndividualPage}>
          {monthsList.map((el) => {
            return (
              <div
                key={String(Date.now()) + el}
                className="date_indiviual_page"
              >
                {el.map((it) => {
                  return (
                    <div
                      key={String(Date.now()) + it}
                      className="indiviual_input_container"
                    >
                      <div
                        className={`indiviual_input_header ${
                          (workCate === 2 && 2020 === year && it < 12) ||
                          (lastYear === year && lastMonth < it)
                            ? "unset_header"
                            : ""
                        } ${isTotal(it)}`}
                      >
                        {it} 월
                      </div>
                      {(lastYear === year && lastMonth < it) ||
                      (workCate === 2 && 2020 === year && it < 12) ? (
                        <>
                          <div className="unset_box">unset</div>
                          <div className="unset_box">unset</div>
                        </>
                      ) : (
                        <>
                          <input
                            maxLength={2}
                            placeholder="근무일수"
                            className={isTotal(it)}
                            defaultValue={monthUnitDefaultValue(it)?.day}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              onChangeInviualInpus(
                                Number(e.currentTarget.value),
                                it,
                                "day"
                              );
                            }}
                          />
                          {type === "shorts" ? (
                            <input
                              className="total"
                              defaultValue={monthUnitDefaultValue(
                                it
                              )?.pay.toLocaleString()}
                              placeholder="월 임금총액"
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                let valueAnswer = e.target.value;
                                if (valueAnswer.includes(",")) {
                                  valueAnswer = valueAnswer.split(",").join("");
                                }
                                e.target.value =
                                  Number(valueAnswer).toLocaleString();
                                onChangeInviualInpus(
                                  Number(valueAnswer),
                                  it,
                                  "pay"
                                );
                              }}
                            />
                          ) : (
                            year_arr.includes(year) &&
                            (year === lastYear - 1 && (it === 1 || it === 2) ? (
                              <></>
                            ) : (
                              <>
                                {month_arr_three.includes(it) && (
                                  <input
                                    className="total"
                                    defaultValue={monthUnitDefaultValue(
                                      it
                                    )?.pay.toLocaleString()}
                                    placeholder="월 임금총액"
                                    onChange={(
                                      e: ChangeEvent<HTMLInputElement>
                                    ) => {
                                      let valueAnswer = e.target.value;
                                      if (valueAnswer.includes(",")) {
                                        valueAnswer = valueAnswer
                                          .split(",")
                                          .join("");
                                      }
                                      e.target.value =
                                        Number(valueAnswer).toLocaleString();
                                      onChangeInviualInpus(
                                        Number(valueAnswer),
                                        it,
                                        "pay"
                                      );
                                    }}
                                  />
                                )}
                              </>
                            ))
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <button
        ref={refPrev}
        className="date_indiviual_prev"
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          refNext.current.style.display = "block";
          if (locationPage === 100) {
            e.currentTarget.style.display = "none";
          }
          const currentRef: any = refIndividualPage.current;
          locationPage -= 100;
          currentRef.style.left = `-${locationPage}%`;
        }}
      >
        <img src={IMGPrev} alt="next button" />
      </button>
      <button
        ref={refNext}
        className="date_indiviual_next"
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          refPrev.current.style.display = "block";
          if (type === "dayJob") {
            if (locationPage >= 100) {
              e.currentTarget.style.display = "none";
            }
          } else {
            if (locationPage >= 0) {
              e.currentTarget.style.display = "none";
            }
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

const _onClickPopUpInvidual = (
  year: number,
  lastWorkDay: string,
  handler: any,
  setSelectYears: Dispatch<SetStateAction<number[]>>,
  type: "dayJob" | "shorts"
) => {
  const workRecordUnitsDays: any = {};
  const workRecordUnitsPays: any = {};
  const onChageMonthsGen = (
    params: string,
    value: number,
    type: "day" | "pay"
  ) => {
    if (type === "day") {
      workRecordUnitsDays[params] = value;
    } else {
      workRecordUnitsPays[params] = value;
    }
  };
  if (!lastWorkDay) {
    CreatePopup(undefined, "마지막 근무일을 선택해주세요", "only_check");
    return;
  }
  const workRecord = handler.GetPageVal("workRecord"),
    workRecordTargetUnit = workRecord.filter((el: any) => {
      return el.year === year;
    });

  CreatePopup(
    `${String(year)} 년`,
    <_PopUpInvidual
      onChangeFunc={onChageMonthsGen}
      lastWorkDay={lastWorkDay}
      year={year}
      workRecord={workRecordTargetUnit[0]}
      type={type}
      workCate={handler.GetPageVal("workCate")}
    />,
    "confirm",
    () => {
      let valid = false;
      if (
        Object.values(workRecordUnitsDays).length +
          Object.values(workRecordUnitsPays).length ===
        0
      ) {
        valid = true;
      }
      if (type === "shorts") {
        if (
          Object.values(workRecordUnitsDays).length !==
          Object.values(workRecordUnitsPays).length
        ) {
          valid = true;
        }
      }

      if (type === "dayJob") {
        Object.keys(workRecordUnitsPays).forEach((el) => {
          if (!Object.keys(workRecordUnitsDays).includes(el)) {
            valid = true;
          }
        });
      }

      if (
        GetDateArr(lastWorkDay)[0] === year ||
        GetDateArr(lastWorkDay)[0] - 1 === year
      ) {
        if (Object.values(workRecordUnitsPays).length === 0) {
          valid = true;
        }
      }

      if (valid) {
        CreatePopup(
          undefined,
          "달마다 근무일수와 월 임금총액을 입력해주세요.",
          "confirm",
          () =>
            _onClickPopUpInvidual(
              year,
              lastWorkDay,
              handler,
              setSelectYears,
              type
            ),
          undefined,
          "확인"
        );
        return;
      }

      const workRecordUnits: any = [];
      Object.keys(workRecordUnitsDays).forEach((el: any) => {
        workRecordUnits.push({
          month: Number(el),
          day: workRecordUnitsDays[el] && Number(workRecordUnitsDays[el]),
          pay: workRecordUnitsPays[el] && Number(workRecordUnitsPays[el]),
        });
      });
      const unit = {
        year,
        months: workRecordUnits,
      };
      setSelectYears((prev: number[]) => {
        return [...prev, year];
      });
      const isDuplicationYear = handler
        .GetPageVal("workRecord")
        .filter((el: any) => {
          return el.year === year;
        });
      const currentWorkRecord =
        isDuplicationYear.length > 0
          ? [
              ...handler.GetPageVal("workRecord").filter((el: any) => {
                return el.year !== year;
              }),
              unit,
            ]
          : [...handler.GetPageVal("workRecord"), unit];

      handler.SetPageVal("workRecord", currentWorkRecord);
      ClosePopup();
    }
  );
};

const WorkRecordGen = ({
  label = "개별 입력란",
  handler,
  type,
}: WorkRecordGenTypes) => {
  const current_year_list = Year_Option_Generater(10);
  const [selectYears, setSelectYears] = useState<number[]>([]);
  useEffect(() => {
    handler.SetPageVal("workRecord", []);
  }, []);
  return (
    <>
      <label className="fs_16 write_label">{label}</label>
      <div className="lndividual_input_container flex_box">
        {current_year_list.map((el: string) => {
          return (
            <div
              onClick={() => {
                if (handler.GetPageVal("workCate") === 2) {
                  if (Number(el) < 2020) {
                    CreatePopup(
                      undefined,
                      "예술인 / 단기예술인은 2020년 12월부터 피보험단위기간이 적용됩니다.",
                      "only_check",
                      () => ClosePopup(),
                      undefined,
                      "확인"
                    );
                    return;
                  }
                }
                _onClickPopUpInvidual(
                  Number(el),
                  handler.GetPageVal("lastWorkDay"),
                  handler,
                  setSelectYears,
                  type
                );
              }}
              key={String(Date.now()) + el}
              className={`fs_16 pd_810 ${
                el && selectYears.includes(Number(el)) ? "select" : ""
              }`}
            >
              {el}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default WorkRecordGen;

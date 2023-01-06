import { Dispatch, SetStateAction } from "react";
import { calRecording } from "../utils/calrecord";
import { getAge, GetDateArr } from "../utils/date";
import { sendToServer } from "../utils/sendToserver";
import { CheckValiDation } from "../utils/validate";
import InputHandler from "./Inputs";

class DetailedHandler extends InputHandler {
  public result: any = {};
  public setCompState: Dispatch<SetStateAction<number>> | undefined = undefined;
  public setTab: Dispatch<SetStateAction<string>> | undefined = undefined;
  public setIsValueSelect01: Dispatch<SetStateAction<number>> | undefined =
    undefined;
  public setIsValueSelect02: Dispatch<SetStateAction<number>> | undefined =
    undefined;
  public setIsValueSelect03: Dispatch<SetStateAction<number>> | undefined =
    undefined;

  public sumWorkDay = (workRecord: any) => {
    let result = 0;
    workRecord.map((el: any) => {
      return el.months.map((el: any) => {
        if (el.day > 10) {
          result += 1;
        }
      });
    });
    return result;
  };

  public sumOneYearResult = (
    workRecord: any,
    lastWorkDate: any,
    type: "day" | "pay" | "two_year"
  ) => {
    let result = 0;
    const lastWorkYear = new Date(lastWorkDate).getFullYear();
    const lastWorkMonth = new Date(lastWorkDate).getMonth() + 1;
    const workMonthArr1 = [];
    const workMonthArr2 = [];
    const workMonthArr3 = [];
    const paysArr: any = [];
    const forLoopCount = type === "two_year" ? 24 : 12;
    const newWorkRecord: any = {};
    for (let i = 0; i < forLoopCount; i++) {
      if (lastWorkMonth - i < 1) {
        if (lastWorkMonth + 12 - i < 1) {
          workMonthArr3.push(lastWorkMonth - i + 24);
          newWorkRecord[lastWorkYear - 2] = workMonthArr3;
        } else {
          workMonthArr2.push(lastWorkMonth + 12 - i);
          newWorkRecord[lastWorkYear - 1] = workMonthArr2;
        }
      } else {
        workMonthArr1.push(lastWorkMonth - i);
        newWorkRecord[lastWorkYear] = workMonthArr1;
      }
    }

    const filterYear = workRecord.filter((el: any, idx: number) => {
      return Object.keys(newWorkRecord).includes(String(el.year));
    });

    filterYear.forEach((el: any, idx: number) => {
      paysArr.push(
        el.months.filter((el: any) => {
          return newWorkRecord[Object.keys(newWorkRecord)[idx]].includes(
            el.month
          );
        })
      );
    });

    paysArr.forEach((el: any) => {
      return el.forEach((el: any) => {
        if (type === "day") {
          result += el.day;
        } else if (type === "pay") {
          result += el.pay;
        } else if (type === "two_year") {
          if (el.day > 10) {
            result += 1;
          }
        }
      });
    });

    return result;
  };
  public insuranceGrade = (retiredDay: Date, enterDay: Date) => {
    const retiredDayYear: any = GetDateArr(retiredDay)[0];
    const enterDayYear: any = GetDateArr(enterDay)[0];
    const answer: any = {};
    if (!this._Data["year0"]) return;
    new Array(retiredDayYear - enterDayYear + 1)
      .fill(1)
      .forEach((_, idx: number) => {
        answer[enterDayYear + idx] = this._Data[`year${idx}`]
          ? this._Data[`year${idx}`].split("등급")[0]
          : this._Data["year0"].split("등급")[0];
      });
    return answer;
  };

  public emeploymentInsuranceTotal = (workRecord: any) => {
    let year = 0;
    let month = 0;
    if (!workRecord) {
      return null;
    } else {
      workRecord.forEach((el: any) => {
        el.months.forEach((it: any) => {
          if (it.day > 10) {
            if (month > 12) {
              year += 1;
            }
            month += 1;
          }
        });
      });
      return [year, month];
    }
  };

  public sumDayJobWorkingDay: (workRecord: any, isSimple?: any) => any = (
    workRecord: any[],
    isSimple: boolean = false
  ) => {
    let sumWorkDay = 0;
    let sumPay = 0;
    let sumThreeMbp = 0;
    let dayAvgPay;
    if (isSimple) {
      return 1;
    } else {
      workRecord.map((v: { year: number; months: any[] }) => {
        v.months.map(
          (v: {
            month: number;
            day: number;
            pay: number;
            three_mbp: number;
          }) => {
            sumWorkDay += v.day ? v.day : 0;
            sumPay += v.pay ? v.pay : 0;
            sumThreeMbp += v.three_mbp ? v.three_mbp : 0;
          }
        );
      });
      dayAvgPay = Math.ceil(sumPay / sumThreeMbp);
    }
    return [sumWorkDay, dayAvgPay];
  };
  public getSumOneYearPay = (arr: any) => {
    let answer: number = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].months.length; j++) {
        answer = answer + arr[i].months[j].pay;
      }
    }
    return answer;
  };
  public Action_Cal_Result = () => {
    const weekDay =
      this._Data.weekDay &&
      Object.values(this._Data.weekDay).map((el) => {
        if (el === "월") {
          return 1;
        }
        if (el === "화") {
          return 2;
        }
        if (el === "수") {
          return 3;
        }
        if (el === "목") {
          return 4;
        }
        if (el === "금") {
          return 5;
        }
        if (el === "토") {
          return 6;
        }
        if (el === "일") {
          return 0;
        }
      });

    const url: string | boolean =
      this._Data.workCate === 0 || this._Data.workCate === 1
        ? "/detail/standard"
        : this._Data.workCate === 2
        ? "/detail/dayjob"
        : this._Data.workCate === 3 || this._Data.workCate === 4
        ? this._Data.is_short === "단기예술인" ||
          this._Data.is_short === "단기특고"
          ? "/detail/art/short"
          : "/detail/art"
        : this._Data.workCate === 5
        ? "/detail/veryShort"
        : this._Data.workCate === 6 && "/detail/employer";
    const to_server =
      this._Data.workCate === 0 || this._Data.workCate === 1 // 정규직 / 기간제
        ? {
            ...this._Data,
            salary: this._Data.salary
              ? Array.isArray(this._Data.salary)
                ? this._Data.salary
                : [this._Data.salary]
              : null,
            weekDay,
            retireReason:
              this._Data.cal_state === "multi" ? 1 : this._Data.retireReason,
            retiredDay: this._Data.retired
              ? this._Data.retiredDay
              : `${GetDateArr(null)[0]}-${GetDateArr(null)[1]}-${
                  GetDateArr(null)[2]
                }`,
            dayWorkTime: this._Data.dayWorkTime
              ? Number(this._Data.dayWorkTime.split("시간")[0])
              : null,
            disabled:
              this._Data.disabled === "장애인"
                ? true
                : this._Data.disabled === "비장애인"
                ? false
                : null,
            age: isNaN(Number(getAge(new Date(String(this._Data.age))).age))
              ? null
              : getAge(new Date(String(this._Data.age))).age,
            limitDay: new Date(
              new Date(this._Data.retiredDay).setMonth(
                new Date().getMonth() - 18
              )
            ),
            isEnd: this._Data.cal_state ? true : false,
          }
        : this._Data.workCate === 2 // 일용직
        ? {
            hasWork: [false, "hasWork"],
            retired: this._Data.retired,
            workCate: 6,
            retireReason:
              this._Data.cal_state === "multi" ? 1 : this._Data.retireReason,
            enrollDay: this._Data.planToDo,
            dayWorkTime: this._Data.dayWorkTime
              ? Number(this._Data.dayWorkTime.split("시간")[0])
              : null,
            lastWorkDay: this._Data.lastWorkDay,
            isSpecial: this._Data.isSpecial ? this._Data.isSpecial : false,
            isSimple: this._Data.input === "개별 입력" ? true : false,
            age: isNaN(Number(getAge(new Date(String(this._Data.age))).age))
              ? null
              : getAge(new Date(String(this._Data.age))).age,
            disabled:
              this._Data.disabled === "장애인"
                ? true
                : this._Data.disabled === "비장애인"
                ? false
                : null,
            isOverTen:
              this._Data.input === "결과만 입력"
                ? false
                : this._Data.isOverTen === undefined
                ? null
                : this._Data.isOverTen === true
                ? this._Data.isOverTen
                : false,
            sumWorkDay: this._Data.workRecord
              ? this.sumDayJobWorkingDay(this._Data.workRecord)[0]
              : this._Data.sumWorkDay,
            dayAvgPay: this._Data.workRecord
              ? this.sumDayJobWorkingDay(this._Data.workRecord)[1]
              : this._Data.dayAvgPay,
            limitDay: new Date(
              new Date(
                this._Data.retiredDay
                  ? this._Data.retiredDay
                  : this._Data.lastWorkDay
              ).setMonth(new Date().getMonth() - 18)
            ),
            isEnd: this._Data.cal_state ? true : false,
          }
        : this._Data.workCate === 3 // 예술인
        ? this._Data.is_short === "단기예술인"
          ? {
              retired: this._Data.retired,
              workCate: 4,
              retireReason:
                this._Data.cal_state === "multi" ? 1 : this._Data.retireReason,
              lastWorkDay: this._Data.lastWorkDay,
              age: isNaN(Number(getAge(new Date(String(this._Data.age))).age))
                ? null
                : getAge(new Date(String(this._Data.age))).age,
              disabled:
                this._Data.disabled === "장애인"
                  ? true
                  : this._Data.disabled === "비장애인"
                  ? false
                  : null,
              enrollDay: this._Data.planToDo,
              sumWorkDay:
                this._Data.input === "결과만 입력"
                  ? this._Data.employ_month + this._Data.employ_year * 12
                  : this.sumWorkDay(this._Data.workRecord),
              sumTwoYearWorkDay: this._Data.workRecord
                ? this.sumOneYearResult(
                    this._Data.workRecord,
                    this._Data.lastWorkDay,
                    "two_year"
                  )
                : 100000,
              sumOneYearWorkDay: this._Data.workRecord
                ? this.sumOneYearResult(
                    this._Data.workRecord,
                    this._Data.lastWorkDay,
                    "day"
                  )
                : 100000,
              sumOneYearPay:
                this._Data.input === "결과만 입력"
                  ? this._Data.sumOneYearPay
                  : this._Data.workRecord
                  ? this.sumOneYearResult(
                      this._Data.workRecord,
                      this._Data.lastWorkDay,
                      "pay"
                    )
                  : null,
              isOverTen:
                this._Data.isOverTen === undefined
                  ? null
                  : this._Data.isOverTen === true
                  ? this._Data.isOverTen
                  : false,
              hasWork: [false, "2022-10-22"],
              limitDay: new Date(
                new Date(this._Data.retiredDay).setMonth(
                  new Date().getMonth() - 24
                )
              ),
              isEnd: this._Data.cal_state ? true : false,
            }
          : {
              ...this._Data,
              workCate: 2,
              retireReason:
                this._Data.cal_state === "multi" ? 1 : this._Data.retireReason,
              isSpecial: false,
              age: isNaN(Number(getAge(new Date(String(this._Data.age))).age))
                ? null
                : getAge(new Date(String(this._Data.age))).age,
              disabled:
                this._Data.disabled === "장애인"
                  ? true
                  : this._Data.disabled === "비장애인"
                  ? false
                  : null,
              sumTwelveMonthSalary: this._Data.sumTwelveMonthSalary
                ? [this._Data.sumTwelveMonthSalary]
                : null,
              retiredDay: this._Data.retired
                ? this._Data.retiredDay
                : `${GetDateArr(null)[0]}-${GetDateArr(null)[1]}-${
                    GetDateArr(null)[2]
                  }`,
              jobCate: 1,
              limitDay: new Date(
                new Date(this._Data.retiredDay).setMonth(
                  new Date().getMonth() - 24
                )
              ),
              isEnd: this._Data.cal_state ? true : false,
            }
        : this._Data.workCate === 4 // 특고
        ? this._Data.is_short === "단기특고"
          ? {
              retired: this._Data.retired,
              workCate: 5,
              retireReason:
                this._Data.cal_state === "multi" ? 1 : this._Data.retireReason,
              lastWorkDay: this._Data.lastWorkDay,
              enrollDay: this._Data.planToDo,
              isSpecial: true,
              age: isNaN(Number(getAge(new Date(String(this._Data.age))).age))
                ? null
                : getAge(new Date(String(this._Data.age))).age,
              disabled: this._Data.disabled === "장애인" ? true : false,
              jobCate: 1,
              sumWorkDay:
                this._Data.input === "결과만 입력"
                  ? this._Data.employ_month + this._Data.employ_year * 12
                  : this.sumWorkDay(this._Data.workRecord),
              sumTwoYearWorkDay: this._Data.workRecord
                ? this.sumOneYearResult(
                    this._Data.workRecord,
                    this._Data.lastWorkDay,
                    "two_year"
                  )
                : 100000,
              sumOneYearWorkDay: this._Data.workRecord
                ? this.sumOneYearResult(
                    this._Data.workRecord,
                    this._Data.lastWorkDay,
                    "day"
                  )
                : 100000,
              sumOneYearPay:
                this._Data.input === "결과만 입력"
                  ? this._Data.sumOneYearPay
                  : this._Data.workRecord
                  ? this.sumOneYearResult(
                      this._Data.workRecord,
                      this._Data.lastWorkDay,
                      "pay"
                    )
                  : null,
              isOverTen: this._Data.isOverTen ? this._Data.isOverTen : false,
              hasWork: [false, "2022-10-22"],
            }
          : {
              ...this._Data,
              workCate: 3,
              isSpecial: true,
              retireReason:
                this._Data.cal_state === "multi" ? 1 : this._Data.retireReason,
              age: isNaN(Number(getAge(new Date(String(this._Data.age))).age))
                ? null
                : getAge(new Date(String(this._Data.age))).age,
              disabled:
                this._Data.disabled === "장애인"
                  ? true
                  : this._Data.disabled === "비장애인"
                  ? false
                  : null,
              sumTwelveMonthSalary: this._Data.sumTwelveMonthSalary
                ? [this._Data.sumTwelveMonthSalary]
                : null,
              retiredDay: this._Data.retired
                ? this._Data.retiredDay
                : `${GetDateArr(null)[0]}-${GetDateArr(null)[1]}-${
                    GetDateArr(null)[2]
                  }`,
              limitDay: new Date(
                new Date(this._Data.retiredDay).setMonth(
                  new Date().getMonth() - 24
                )
              ),
              isEnd: this._Data.cal_state ? true : false,
            }
        : this._Data.workCate === 5 // 초단 시간
        ? {
            workCate: 7,
            retired: this._Data.retired,
            enterDay: this._Data.enterDay ? this._Data.enterDay : null,
            retireReason:
              this._Data.cal_state === "multi" ? 1 : this._Data.retireReason,
            age: isNaN(Number(getAge(new Date(String(this._Data.age))).age))
              ? null
              : getAge(new Date(String(this._Data.age))).age,
            weekDay,
            disabled:
              this._Data.disabled === "장애인"
                ? true
                : this._Data.disabled === "비장애인"
                ? false
                : null,
            dayWorkTime:
              this._Data["time"] && this._Data["week"]
                ? Math.floor(this._Data["time"] / this._Data["week"])
                : null,
            retiredDay: this._Data.retired
              ? this._Data.retiredDay
              : `${GetDateArr(null)[0]}-${GetDateArr(null)[1]}-${
                  GetDateArr(null)[2]
                }`,
            salary: this._Data.salary
              ? Array.isArray(this._Data.salary)
                ? this._Data.salary
                : [this._Data.salary]
              : null,
            time: this._Data.time ? this._Data.time : null,
            week: this._Data.week ? this._Data.week : null,
            limitDay: new Date(
              new Date(this._Data.retiredDay).setMonth(
                new Date().getMonth() - 24
              )
            ),
            isEnd: this._Data.cal_state ? true : false,
          }
        : this._Data.workCate === 6 // 자영업자
        ? {
            retireReason: this._Data.retireReason
              ? this._Data.cal_state === "multi"
                ? 1
                : this._Data.retireReason
              : null,
            retired: this._Data.retired ? this._Data.retired : null,
            workCate: 8,
            enterDay: this._Data.enterDay,
            retiredDay: this._Data.retiredDay,
            insuranceGrade:
              this._Data.retiredDay && this._Data.enterDay
                ? this.insuranceGrade(
                    this._Data.retiredDay,
                    this._Data.enterDay
                  )
                  ? this.insuranceGrade(
                      this._Data.retiredDay,
                      this._Data.enterDay
                    )
                  : null
                : null,
            limitDay: new Date(
              new Date(this._Data.retiredDay).setMonth(
                new Date().getMonth() - 24
              )
            ),
            isEnd: this._Data.cal_state ? true : false,
            isMany: this._Data.cal_state ? true : false,
          }
        : {};
    const validCheckType =
      this._Data.workCate === 0 || this._Data.workCate === 1
        ? "detail_standad"
        : this._Data.workCate === 3 || this._Data.workCate === 4
        ? this._Data.is_short === "단기예술인" ||
          this._Data.is_short === "단기특고"
          ? "detail_shorts"
          : "detail_art"
        : this._Data.workCate === 2
        ? "detail_dayjob"
        : this._Data.workCate === 5
        ? "detail_veryshorts"
        : this._Data.workCate === 6 && "detail_employ";

    delete to_server.popup_select;

    if (
      !CheckValiDation(validCheckType ? validCheckType : "standad", to_server)
    )
      return;
    delete to_server.week;
    delete to_server.time;

    if (this._Data.workCate === 3 || this._Data.workCate === 4) {
      this.result["is_short"] = this._Data.is_short;
    }
    if (this._Data.cal_state !== "multi") {
      this.setCompState && this.setCompState(5);
      setTimeout(() => {
        this.setCompState && this.setCompState(4);
      }, 2000);
    }

    return sendToServer(url, to_server);
  };
}

export default DetailedHandler;

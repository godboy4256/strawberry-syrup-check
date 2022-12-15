import { Dispatch, SetStateAction } from "react";
import { getAge, GetDateArr } from "../utils/date";
import { sendToServer } from "../utils/sendToserver";
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

  public insuranceGrade = (retiredDay: Date, enterDay: Date) => {
    const retiredDayYear = GetDateArr(retiredDay)[0];
    const enterDayYear = GetDateArr(enterDay)[0];
    const answer: any = {};
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
  };

  public sumDayJobWorkingDay: (workRecord: any, isSimple?: any) => any = (
    workRecord: any[],
    isSimple: boolean = false
  ) => {
    let sumWorkDay = 0;
    let sumPay = 0;
    let dayAvgPay;
    if (isSimple) {
      return 1;
    } else {
      workRecord.map((v: { year: number; months: any[] }) => {
        v.months.map((v: { month: number; day: number; pay: number }) => {
          sumWorkDay += v.day;
          sumPay += v?.pay;
        });
      });
      dayAvgPay = Math.ceil(sumPay / sumWorkDay);
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
  public Action_Cal_Result = async () => {
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
            salary: Array.isArray(this._Data.salary)
              ? this._Data.salary
              : [this._Data.salary],
            weekDay,
            dayWorkTime: Number(
              String(this._Data.dayWorkTime).split("시간")[0]
            ),
            disabled: this._Data.disabled === "장애인" ? true : false,
            age: getAge(new Date(String(this._Data.age))).age,
          }
        : this._Data.workCate === 2 // 일용직
        ? {
            retired: this._Data.retired,
            workCate: this._Data.workCate,
            retireReason: this._Data.retireReason,
            dayWorkTime: Number(this._Data.dayWorkTime.split("시간")[0]),
            lastWorkDay: this._Data.lastWorkDay,
            isSpecial: this._Data.isSpecial,
            age: getAge(new Date(String(this._Data.age))).age,
            disable: this._Data.disabled === "장애인" ? true : false,
            isOverTen: this._Data.isOverTen ? this._Data.isOverTen : false,
            sumWorkDay: this._Data.workRecord
              ? this.sumDayJobWorkingDay(this._Data.workRecord)[0]
              : this._Data.sumWorkDay,
            dayAvgPay: this._Data.workRecord
              ? this.sumDayJobWorkingDay(this._Data.workRecord)[1]
              : this._Data.dayAvgPay,
          }
        : this._Data.workCate === 3 // 예술인
        ? this._Data.is_short === "단기예술인"
          ? {
              retired: this._Data.retired,
              workCate: this._Data.workCate,
              retireReason: this._Data.retireReason,
              lastWorkDay: this._Data.lastWorkDay,
              age: getAge(new Date(String(this._Data.age))).age,
              disable: this._Data.disabled === "장애인" ? true : false,
              sumOneYearWorkDay:
                this._Data.input === "결과만 입력"
                  ? [this._Data.employ_year, this._Data.employ_month]
                  : this.emeploymentInsuranceTotal(this._Data.workRecord),
              sumOneYearPay:
                this._Data.input === "결과만 입력"
                  ? this._Data.sumOneYearPay
                  : this.getSumOneYearPay(this._Data.workRecord),
              isOverTen: this._Data.isOverTen ? this._Data.isOverTen : false,
              hasWork: [false, "11"],
            }
          : {
              ...this._Data,
              age: getAge(new Date(String(this._Data.age))).age,
              disabled: this._Data.disabled === "장애인" ? true : false,
              sumTwelveMonthSalary: [this._Data.sumTwelveMonthSalary],
            }
        : this._Data.workCate === 4 // 특고
        ? this._Data.is_short === "단기특고"
          ? {
              retired: this._Data.retired,
              workCate: this._Data.workCate,
              retireReason: this._Data.retireReason,
              lastWorkDay: this._Data.lastWorkDay,
              age: getAge(new Date(String(this._Data.age))).age,
              disable: this._Data.disabled === "장애인" ? true : false,
              sumOneYearWorkDay:
                this._Data.input === "결과만 입력"
                  ? [this._Data.employ_year, this._Data.employ_month]
                  : this._Data.workRecord.map((el: any) => {
                      return el.months.map((el: any) => {
                        return Number(el.day);
                      });
                    })[0],
              sumOneYearPay:
                this._Data.input === "결과만 입력"
                  ? this._Data.sumOneYearPay
                  : this.getSumOneYearPay(this._Data.workRecord),
              isOverTen: this._Data.isOverTen ? this._Data.isOverTen : false,
              hasWork: [false, "11"],
            }
          : {
              ...this._Data,
              age: getAge(new Date(String(this._Data.age))).age,
              disabled: this._Data.disabled === "장애인" ? true : false,
              sumTwelveMonthSalary: [this._Data.sumTwelveMonthSalary],
            }
        : this._Data.workCate === 5 // 초단 시간
        ? {
            ...this._Data,
            age: getAge(new Date(String(this._Data.age))).age,
            weekDay,
            disable: this._Data.disabled === "장애인" ? true : false,
            dayWorkTime:
              this._Data.dayWorkTime["time"] / this._Data.dayWorkTime["week"],
            reitredDay: this._Data.retiredDay,
          }
        : this._Data.workCate === 6 // 자영업자
        ? {
            enterDay: this._Data.enterDay,
            retiredDay: this._Data.retiredDay,
            insuranceGrade: this.insuranceGrade(
              this._Data.retiredDay,
              this._Data.enterDay
            ),
          }
        : {};
    console.log(to_server);
    this.result = await sendToServer(url, to_server);
    if (this._Data.workCate === 3 || this._Data.workCate === 4) {
      this.result["is_short"] = this._Data.is_short;
    }
    this.setCompState && this.setCompState(5);
    setTimeout(() => {
      this.setCompState && this.setCompState(4);
    }, 2000);
  };
}

export default DetailedHandler;

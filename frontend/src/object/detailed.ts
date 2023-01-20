import { Dispatch, SetStateAction } from "react";
import { getAge, GetDateArr } from "../utils/date";
import { sendToServer } from "../utils/sendToserver";
import { CheckValiDation } from "../utils/validate";
import { DetailPathCal } from "./common";
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

  public getDayAvgPay = (
    workRecord: {
      year: number;
      months: {
        month: number;
        three_mbp?: number;
        pay?: number;
        day?: number;
      }[];
    }[]
  ) => {
    let pays = 0,
      days = 0;
    workRecord.forEach((el) => {
      el.months.forEach((years) => {
        if (years.pay && years.pay !== 0) {
          pays += years.pay;
          days += new Date(el.year, years.month, 0).getDate();
        }
      });
    });
    return Math.ceil(pays / days);
  };
  public sumCal = (
    type: "pay" | "sumWorkDay" | "twoYear" | "sumWorkDayAll",
    workRecord: {
      year: number;
      months: { month: number; pay: number; day: number; three_mbp?: number }[];
    }[]
  ) => {
    let answer = 0,
      notOverTen = 0;

    if (type === "pay") {
      workRecord.forEach((year) => {
        year.months.forEach((el) => {
          if (el.pay) answer += el.pay;
        });
      });
      return answer;
    }
    if (type === "sumWorkDay") {
      workRecord.forEach((year) => {
        year.months.forEach((el) => {
          if (el.day >= 11) {
            answer += 1;
          } else {
            notOverTen += el.day;
          }
        });
      });
      return answer + Math.ceil((notOverTen / 22) * 10) / 10;
    }
    if (type === "twoYear") {
      workRecord.forEach((year, idx) => {
        if (idx === 2) {
          return;
        } else {
          year.months.forEach((el) => {
            if (el.day >= 11) {
              answer += 1;
            } else {
              notOverTen += el.day;
            }
          });
        }
      });
      return answer + Math.ceil((notOverTen / 22) * 10) / 10;
    }
    if (type === "sumWorkDayAll") {
      workRecord.forEach((el) => {
        el.months.forEach((years) => {
          answer += years?.day;
        });
      });
      return answer;
    }
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

    const limitDay = GetDateArr(
      new Date(
        new Date(
          this._Data.retiredDay ? this._Data.retiredDay : this._Data.lastWorkDay
        ).setMonth(
          new Date().getMonth() -
            (this._Data.workCate === 0 || this._Data.workCate === 1 ? 18 : 24)
        )
      )
    );

    const workCate =
      this._Data.is_short === "단기예술인"
        ? 4
        : this._Data.is_short === "단기특고"
        ? 5
        : this._Data.is_short !== "단기예술인" && this._Data.workCate === 4
        ? 6
        : this._Data.is_short !== "단기특고" && this._Data.workCate === 5
        ? 7
        : this._Data.workCate === 6
        ? 8
        : this._Data.workCate;

    const to_server_common = {
      retired: this._Data.retired ? this._Data.retired : true,
      workCate: workCate,
      retireReason: this._Data.retireReason ? this._Data.retireReason : 10,
      age: isNaN(Number(getAge(new Date(String(this._Data.age))).age))
        ? null
        : getAge(new Date(String(this._Data.age))).age,
      disabled:
        this._Data.disabled === "장애인"
          ? true
          : this._Data.disabled === "비장애인"
          ? false
          : null,
      isMany: this._Data.cal_state === "multi" ? true : false,
      limitDay: `${limitDay[0]}-${limitDay[1]}-${limitDay[2]}`,
    };

    const to_server_datas: any =
      workCate === 0 || workCate === 1 // 정규직 / 기간제
        ? {
            salary: this._Data.salary
              ? Array.isArray(this._Data.salary)
                ? this._Data.salary
                : [this._Data.salary]
              : null,
            weekDay,
            enterDay: this._Data.enterDay ? this._Data.enterDay : null,
            retiredDay: this._Data.retired
              ? this._Data.retiredDay
              : `${GetDateArr(null)[0]}-${GetDateArr(null)[1]}-${
                  GetDateArr(null)[2]
                }`,
            dayWorkTime: this._Data.dayWorkTime
              ? Number(this._Data.dayWorkTime.split("시간")[0])
              : null,
          }
        : workCate === 2 || workCate === 3
        ? {
            isSpecial: false,
            enterDay: this._Data.enterDay ? this._Data.enterDay : null,
            sumTwelveMonthSalary: this._Data.sumTwelveMonthSalary
              ? [this._Data.sumTwelveMonthSalary]
              : null,
            retiredDay: this._Data.retired
              ? this._Data.retiredDay
              : `${GetDateArr(null)[0]}-${GetDateArr(null)[1]}-${
                  GetDateArr(null)[2]
                }`,
            jobCate: this._Data.workCate === 3 ? this._Data.jobCate : null,
          }
        : workCate === 4 || workCate === 5
        ? {
            isMany: this._Data.cal_state === "multi" ? true : false,
            isSpecial: false,
            hasWork: this._Data.hasWork ? this._Data.hasWork : true,
            enrollDay: this._Data.planToDo,
            lastWorkDay: this._Data.lastWorkDay,
            sumWorkDay:
              this._Data.input === "결과만 입력"
                ? this._Data.employ_month + this._Data.employ_year * 12
                : this.sumCal("sumWorkDay", this._Data.workRecord),
            sumTwoYearWorkDay: this._Data.workRecord
              ? this.sumCal("twoYear", this._Data.workRecord)
              : null,
            sumOneYearPay:
              this._Data.input === "개별 입력"
                ? this.sumCal("pay", this._Data.workRecord)
                : this._Data.sumOneYearPay,
            isOverTen:
              this._Data.isOverTen === undefined
                ? null
                : this._Data.isOverTen === true
                ? this._Data.isOverTen
                : false,
            isSimple: this._Data.input === "개별 입력" ? false : true,
            jobCate: this._Data.workCate === 3 ? 1 : null,
          }
        : workCate === 6 // 일용직
        ? {
            hasWork: this._Data.hasWork ? this._Data.hasWork : false,
            enrollDay: this._Data.planToDo,
            dayWorkTime: this._Data.dayWorkTime
              ? Number(this._Data.dayWorkTime.split("시간")[0])
              : null,
            lastWorkDay: this._Data.lastWorkDay,
            isSpecial: this._Data.isSpecial ? this._Data.isSpecial : false,
            isSimple: this._Data.input === "개별 입력" ? false : true,
            isOverTen:
              this._Data.input === "결과만 입력"
                ? false
                : this._Data.isOverTen === undefined
                ? null
                : this._Data.isOverTen === true
                ? this._Data.isOverTen
                : false,
            sumWorkDay: this._Data.workRecord
              ? this.sumCal("sumWorkDayAll", this._Data.workRecord)
              : this._Data.sumWorkDay,
            dayAvgPay: this._Data.workRecord
              ? this.getDayAvgPay(this._Data.workRecord)
              : this._Data.dayAvgPay,
          }
        : workCate === 7 // 초단 시간
        ? {
            enterDay: this._Data.enterDay,
            retiredDay: this._Data.retiredDay,
            weekDay,
            salary: this._Data.salary
              ? Array.isArray(this._Data.salary)
                ? this._Data.salary
                : [this._Data.salary]
              : null,
            weekWorkTime: this._Data.time ? this._Data.time : null,
          }
        : workCate === 8 // 자영업자
        ? {
            isEnd: true, // 서버에 없앨 것을 요청
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
          }
        : {};
    // const validCheckType =
    //   this._Data.workCate === 0 || this._Data.workCate === 1
    //     ? "detail_standad"
    //     : this._Data.workCate === 3 || this._Data.workCate === 4
    //     ? this._Data.is_short === "단기예술인" ||
    //       this._Data.is_short === "단기특고"
    //       ? "detail_shorts"
    //       : "detail_art"
    //     : this._Data.workCate === 2
    //     ? "detail_dayjob"
    //     : this._Data.workCate === 5
    //     ? "detail_veryshorts"
    //     : this._Data.workCate === 6 && "detail_employ";

    // if (
    //   !CheckValiDation(
    //     validCheckType ? validCheckType : "standad",
    //     to_server_datas
    //   )
    // )
    //   return;
    if (this._Data.workCate === 3 || this._Data.workCate === 4) {
      this.result["is_short"] = this._Data.is_short;
    }
    if (this._Data.cal_state !== "multi") {
      this.setCompState && this.setCompState(5);
      setTimeout(() => {
        this.setCompState && this.setCompState(4);
      }, 1000);
    }
    const url = DetailPathCal(workCate);
    const to_servers = { ...to_server_common, ...to_server_datas };
    return this._Data.cal_state !== "multi"
      ? sendToServer(url ? url : "", to_servers)
      : to_servers;
  };
}

export default DetailedHandler;

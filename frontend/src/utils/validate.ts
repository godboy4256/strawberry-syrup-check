import { ClosePopup, CreatePopup } from "../components/common/popup";

const null_check_list: any = {
  standad: ["enterDay", "retiredDay", "salary"],
  common: ["age"],
  detail_standad: [
    "age",
    "enterDay",
    "retiredDay",
    "weekDay",
    "dayWorkTime",
    "salary",
  ],
  detail_dayjob1: [
    "age",
    "lastWorkDay",
    "sumWorkDay",
    "dayAvgPay",
    "enrollDay",
    "isOverTen",
  ],
  detail_dayjob2: [
    "age",
    "lastWorkDay",
    "sumWorkDay",
    "dayAvgPay",
    "dayWorkTime",
  ],
  detail_art1: ["age", "enterDay", "retiredDay", "sumTwelveMonthSalary"],
  detail_art2: [
    "age",
    "enterDay",
    "retiredDay",
    "jobCate",
    "sumTwelveMonthSalary",
  ],
  detail_shorts1: [
    "age",
    "lastWorkDay",
    "sumOneYearPay",
    "enrollDay",
    "hasWork",
  ],
  detail_shorts2: ["age", "lastWorkDay", "sumOneYearPay", "sumWorkDay"],
  detail_veryshorts: [
    "age",
    "enterDay",
    "retiredDay",
    "salary",
    "weekDay",
    "weekWorkTime",
  ],
  detail_employ: ["insuranceGrade", "enterDay", "retiredDay"],
  multi_one: ["age", "companys_list"],
};

const valid_null_check_message: any = {
  standad: {
    enterDay: "입사일을 선택해주세요.",
    retiredDay: "퇴사일을 선택해주세요.",
    salary: "월 급여를 기입해주세요.",
  },
  detail_standad: {
    enterDay: "입사일을 선택해주세요.",
    retiredDay: "퇴사일을 선택해주세요.",
    salary: "월 급여를 기입해주세요.",
    age: "생년월일을 선택해주세요.",
    weekDay: "근무 요일을 선택해주세요.",
    dayWorkTime: "근무 시간을 선택해주세요.",
  },
  detail_dayjob1: {
    age: "생년월일을 선택해주세요.",
    lastWorkDay: "마지막 근무일을 선택해주세요.",
    sumWorkDay:
      "고용보험 총 기간 ( 개별입력 , 개별 입력 선택시 ) 을 입력해주세요.",
    dayAvgPay: "1일 평균임금 ( 개별입력 , 개별 입력 선택시 ) 을 입력해주세요.",
    isOverTen: "최근 근로일 정보를 선택해주세요.",
    enrollDay: "신청 예정일을 선택해주세요.",
  },
  detail_dayjob2: {
    age: "생년월일을 선택해주세요.",
    lastWorkDay: "마지막 근무일을 선택해주세요.",
    sumWorkDay: "고용보험 총 기간을 입력해주세요.",
    dayAvgPay: "1일 평균임금을 입력해주세요.",
    dayWorkTime: "마지막 근무시간을 입력해주세요.",
  },
  detail_art1: {
    enterDay: "고용 보험 가입일을 선택해주세요.",
    retiredDay: "고용 보험 종료일을 선택해주세요.",
    age: "생년월일을 선택해주세요.",
    sumTwelveMonthSalary: "퇴직 전 12개월 급여 총액을 입력해주세요.",
  },
  detail_art2: {
    enterDay: "고용 보험 가입일을 선택해주세요.",
    retiredDay: "고용 보험 종료일을 선택해주세요.",
    age: "생년월일을 선택해주세요.",
    jobCate: "직종을 선택해주세요.",
    sumTwelveMonthSalary: "퇴직 전 12개월 급여 총액을 입력해주세요.",
  },
  detail_shorts1: {
    lastWorkDay: "마지막 근무일을 선택해주세요.",
    age: "생년월일을 선택해주세요.",
    sumOneYearPay: "개별 입력란 ( 퇴직전 12개월 근로 정보 ) 을 입력해주세요.",
    enrollDay: "신청 예정일을 선택해주세요.",
    hasWork: "최근 근로일 정보를 입력해주세요.",
  },
  detail_shorts2: {
    lastWorkDay: "마지막 근무일을 선택해주세요.",
    age: "생년월일을 선택해주세요.",
    sumOneYearPay: "퇴직 전 12개월 급여 총액을 입력해주세요.",
    sumWorkDay: "고용 보험 총 기간을 입력해주세요.",
  },
  detail_veryshorts: {
    enterDay: "입사일을 선택해주세요.",
    retiredDay: "퇴사일을 선택해주세요.",
    age: "생년월일을 선택해주세요.",
    salary: "월 급여를 기입해주세요.",
    weekDay: "근무 요일을 선택해주세요.",
    weekWorkTime: "주 근무 시간을 선택해주세요.",
  },
  detail_employ: {
    enterDay: "고용 보험 가입일을 선택해주세요.",
    retiredDay: "고용 보험 종료일을 선택해주세요.",
    insuranceGrade: "고용 보험 등급을 입력해주세요.",
  },
  multi_one: {
    age: "생년월일을 선택해주세요.",
    companys_list: "두 개 이상의 근무 정보가 필요합니다.",
  },
};

const null_check_rules = (
  type:
    | "standad"
    | "detail_standad"
    | "detail_dayjob1"
    | "detail_dayjob2"
    | "detail_art1"
    | "detail_art2"
    | "detail_shorts1"
    | "detail_shorts2"
    | "detail_veryshorts"
    | "detail_employ"
    | "multi_one",
  to_server: any
) => {
  let answer = true;
  null_check_list[type].forEach((el: string) => {
    console.log("null_check", to_server[el]);
    console.log("to_server", to_server);
    if (to_server[el] === null || to_server[el] === undefined) {
      CreatePopup(
        undefined,
        valid_null_check_message[type][el],
        "only_check",
        () => ClosePopup()
      );
      answer = false;
    }
  });

  return answer;
};

const retired_day_rules = (retiredDay: Date, enterDay: Date) => {
  let answer = true;
  const retiredDayDate = new Date(retiredDay);
  const enterDayDate = new Date(enterDay);
  if (retiredDayDate < enterDayDate) {
    CreatePopup(
      undefined,
      "퇴사일이 입사일보다 빠를 수 없습니다.",
      "only_check",
      () => ClosePopup()
    );
    answer = false;
  }
  return answer;
};

export const CheckValiDation = (
  type:
    | "standad"
    | "detail_standad"
    | "detail_dayjob1"
    | "detail_dayjob2"
    | "detail_art1"
    | "detail_art2"
    | "detail_shorts1"
    | "detail_shorts2"
    | "detail_veryshorts"
    | "detail_employ"
    | "multi_one",
  to_server: any
) => {
  let answer = true;
  if (type === "standad") {
    if (!null_check_rules(type, to_server)) answer = false;
    if (!retired_day_rules(to_server["retiredDay"], to_server["enterDay"]))
      answer = false;
  }
  if (type === "detail_standad") {
    if (!null_check_rules(type, to_server)) answer = false;
    if (!retired_day_rules(to_server["retiredDay"], to_server["enterDay"]))
      answer = false;
  }
  if (type === "detail_dayjob1") {
    if (!null_check_rules(type, to_server)) answer = false;
    if (!retired_day_rules(to_server["retiredDay"], to_server["enterDay"]))
      answer = false;
  }
  if (type === "detail_dayjob2") {
    if (!null_check_rules(type, to_server)) answer = false;
    if (!retired_day_rules(to_server["retiredDay"], to_server["enterDay"]))
      answer = false;
  }
  if (type === "detail_art1") {
    if (!null_check_rules(type, to_server)) answer = false;
    if (!retired_day_rules(to_server["retiredDay"], to_server["enterDay"]))
      answer = false;
  }
  if (type === "detail_art2") {
    if (!null_check_rules(type, to_server)) answer = false;
    if (!retired_day_rules(to_server["retiredDay"], to_server["enterDay"]))
      answer = false;
  }
  if (type === "detail_veryshorts") {
    if (!null_check_rules(type, to_server)) answer = false;
    if (!retired_day_rules(to_server["retiredDay"], to_server["enterDay"]))
      answer = false;
  }
  if (type === "detail_employ") {
    if (!null_check_rules(type, to_server)) answer = false;
    if (!retired_day_rules(to_server["retiredDay"], to_server["enterDay"]))
      answer = false;
  }
  if (type === "detail_shorts1") {
    if (!null_check_rules(type, to_server)) answer = false;
    if (!retired_day_rules(to_server["retiredDay"], to_server["enterDay"]))
      answer = false;
  }
  if (type === "detail_shorts2") {
    if (!null_check_rules(type, to_server)) answer = false;
    if (!retired_day_rules(to_server["retiredDay"], to_server["enterDay"]))
      answer = false;
  }
  if (type === "multi_one") {
    if (!null_check_rules(type, to_server)) {
      answer = false;
    } else {
      const companys_list = to_server?.companys_list?.filter((el: any) => {
        return el.emoticon;
      });
      if (companys_list.length < 2) {
        CreatePopup(
          undefined,
          valid_null_check_message[type]["companys_list"],
          "only_check",
          () => ClosePopup()
        );
        answer = false;
      }
    }
  }

  return answer;
};

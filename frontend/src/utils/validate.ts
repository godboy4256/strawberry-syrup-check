import { ClosePopup, CreatePopup } from "../components/common/Popup";

const null_check_list: any = {
  standad: ["enterDay", "retiredDay", "salary"],
  detail_standad: [
    "age",
    "disabled",
    "enterDay",
    "retiredDay",
    "weekDay",
    "dayWorkTime",
    "salary",
  ],
  detail_dayjob: [
    "age",
    "disable",
    "lastWorkDay",
    "sumWorkDay",
    "dayAvgPay",
    "isOverTen",
    "dayWorkTime",
  ],
  detail_art: [
    "age",
    "disabled",
    "enterDay",
    "retiredDay",
    "sumTwelveMonthSalary",
  ],
  detail_shorts: [
    "age",
    "disable",
    "lastWorkDay",
    "sumOneYearPay",
    "sumOneYearWorkDay",
  ],
  detail_veryshorts: [
    "age",
    "disable",
    "enterDay",
    "reitredDay",
    "salary",
    "weekDay",
    "week",
    "time",
  ],
  detail_employ: ["insuranceGrade", "enterDay", "retiredDay"],
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
    disabled: "장애여부를 선택해주세요.",
    weekDay: "근무 요일을 선택해주세요.",
    dayWorkTime: "근무 시간을 선택해주세요.",
  },
  detail_dayjob: {
    age: "생년월일을 선택해주세요.",
    disable: "장애여부를 선택해주세요.",
    lastWorkDay: "마지막 근무일을 선택해주세요.",
    sumWorkDay:
      "고용보험 총 기간 ( 개별입력 , 개별 입력 선택시 ) 을 입력해주세요.",
    dayAvgPay: "1일 평균임금 ( 개별입력 , 개별 입력 선택시 ) 을 입력해주세요.",
    isOverTen: "최근 근로일 정보를 선택해주세요.",
    dayWorkTime: "마지막 근무시간을 입력해주세요.",
  },
  detail_art: {
    enterDay: "고용 보험 가입일을 선택해주세요.",
    retiredDay: "고용 보험 종료일을 선택해주세요.",
    age: "생년월일을 선택해주세요.",
    disabled: "장애여부를 선택해주세요.",
    sumTwelveMonthSalary: "퇴직 전 12개월 급여 총액을 입력해주세요.",
  },
  detail_shorts: {
    lastWorkDay: "마지막 근무일을 선택해주세요.",
    age: "생년월일을 선택해주세요.",
    disable: "장애여부를 선택해주세요.",
    sumOneYearPay:
      "퇴직 전 12개월 급여 총액( 개별 입력탭 선택시에는 개별 입력란 )을 입력해주세요.",
    sumOneYearWorkDay:
      "고용 보험 총 기간( 개별 입력탭 선택시에는 개별 입력란, 결과만 입력 탭 선택시 년과 개월 모두 입력 )을 입력해주세요.",
  },
  detail_veryshorts: {
    enterDay: "입사일을 선택해주세요.",
    reitredDay: "퇴사일을 선택해주세요.",
    age: "생년월일을 선택해주세요.",
    disable: "장애여부를 선택해주세요.",
    salary: "월 급여를 기입해주세요.",
    weekDay: "근무 요일을 선택해주세요.",
    time: "주 근무 시간을 선택해주세요.",
    week: "주 근무 일수를 선택해주세요.",
  },
  detail_employ: {
    enterDay: "고용 보험 가입일을 선택해주세요.",
    retiredDay: "고용 보험 종료일을 선택해주세요.",
    insuranceGrade: "고용 보험 등급을 입력해주세요.",
  },
};

const null_check_rules = (
  type:
    | "standad"
    | "detail_standad"
    | "detail_dayjob"
    | "detail_art"
    | "detail_shorts"
    | "detail_veryshorts"
    | "detail_employ",
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
    CreatePopup(undefined, "퇴사일이 입사일보다 빠릅니다.", "only_check", () =>
      ClosePopup()
    );
    answer = false;
  }
  return answer;
};

export const CheckValiDation = (
  type:
    | "standad"
    | "detail_standad"
    | "detail_dayjob"
    | "detail_art"
    | "detail_shorts"
    | "detail_veryshorts"
    | "detail_employ",
  to_server: any
) => {
  let answer = true;
  console.log("type", type);
  console.log("to_server", to_server);
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

  if (type === "detail_dayjob") {
    if (!null_check_rules(type, to_server)) answer = false;
    if (!retired_day_rules(to_server["retiredDay"], to_server["enterDay"]))
      answer = false;
  }

  if (type === "detail_art") {
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

  if (type === "detail_shorts") {
    if (!null_check_rules(type, to_server)) answer = false;
    if (!retired_day_rules(to_server["retiredDay"], to_server["enterDay"]))
      answer = false;
  }

  return answer;
};

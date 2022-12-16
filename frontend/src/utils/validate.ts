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
  ],
  detail_art: [
    "age",
    "disabled",
    "enterDay",
    "retiredDay",
    "sumTwelveMonthSalary",
  ],
  detail_veryshorts: [
    "age",
    "disabled",
    "enterDay",
    "retiredDay",
    "sumTwelveMonthSalary",
  ],
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
  },
  detail_art: {
    enterDay: "고용 보험 가입일을 선택해주세요.",
    retiredDay: "고용 보험 종료일을 선택해주세요.",
    age: "생년월일을 선택해주세요.",
    disabled: "장애여부를 선택해주세요.",
    sumTwelveMonthSalary: "퇴직 전 12개월 급여 총액을 입력해주세요.",
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

const arr_data_zerolength_rules = (data_arr: any[], comment: string) => {
  let answer = true;
  if (data_arr.length === 0) {
    CreatePopup(undefined, comment, "only_check");
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
  console.log(type);
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

  return answer;
};

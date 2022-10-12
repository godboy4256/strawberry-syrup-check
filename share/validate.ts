/**
 * 근로형태
 * 0: 정규직, 기간제
 * 1: 예술인, 특고
 * 2: 단기 예술인, 단기 특고
 * 3: 일용직
 * 4: 초단시간
 * 5: 자영업
 *
 * 퇴직사유
 * 0: 권고사직
 * 1: 계약만료
 * 2: 질병
 * 3: 임신/출산/육아
 * 4:회사 잘못
 * 5: 원거리 통근
 * 6: 정년퇴직
 * 7: 소득감소
 * 8: 기타 비자발적 퇴사
 * 9: 매출액 감소
 * 10: 적자지속
 * 11: 자연재해
 * 12: 기타 불가피한 사유
 */

 export const DefineParamInfo = {
  retired: { // 퇴사여부
    type: 'boolean'
  },
  severancePay: { // 퇴직금
    type: "number",
    minimum: 0,
  },
  salary: { // 월급
    type: "number",
    minimum: 0,
    maximum: 9999999999,
  },
  workCate: { // 근로형태
    type: "number",
    minimum: 0,
    maximum: 5,
  },
  retireReason: { // 퇴직사유
    type: "number",
    minimum: 0,
    maximum: 12,
  },
  subYear: {
    // 총 고용보험 가입 기간 (년)(단기예술인 등)
    type: "number",
    minimum: 0,
    maximum: 50,
  },
  subMonth: {
    // 총 고용보험 가입 기간 (월)(단기예술인 등)
    type: "number",
    minimum: 0,
    maximum: 11,
  },
  weekWorkTime: {
    // 주 근무시간 (초단시간 등)
    type: "number",
    minimum: 1,
    maximum: 14,
  },
  weekWorkDay: {
    // 주 근무일 (초단시간 등)
    type: "number",
    minimum: 1,
    maximum: 2,
  },
  grade: {
    // 자영업자 고용보험 등급
    type: "number",
    minimum: 1,
    maximum: 10,
  },
  enterDay: { // 입사일
    type: 'string'
  },
  retiredDay: { // 퇴사일
    type: 'string'
  }


};

export const DefinedParamErrorMesg: { [col_: string]: string } = {
  birth: "생년월일을 입력해주세요",
  disabled: "장애여부를 선택해주세요",
  enterDay: "입사일 및 퇴사일을 입력해주세요",
  retiredDay: "입사일 및 퇴사일을 입력해주세요",
  ealryRetire: "퇴사일이 입사일보다 빠릅니다.",
  salary: "월 급여를 입력해 주세요"  
}

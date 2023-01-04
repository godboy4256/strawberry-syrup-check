/** 근료형태
 * 0: 정규직
 * 1: 기간제
 * 2: 예술인
 * 3: 특고
 * 4: 단기 예술인
 * 5: 단기 특고
 * 6: 일용직
 * 7: 초단시간
 * 8: 자영업
 */

/**
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

/**
 * 특고 직종
 *
 * 2021. 07. 01.
 * 0: 보험설계사
 * 1: 신용카드 회원모집인
 * 2: 대출모집인
 * 3: 학습지(학습사?) 방문강사
 * 4: 교육교구 방문강사
 * 5: 택배 기사
 * 6: 대여제품
 * 7: 대여제품 방문점검원
 * 8: 가전제품 배송 설치기사
 * 9: 방문판매원
 * 10: 건설기계조종사
 * 11: 방과후학교 강사 *
 * 12: 화물차주 (시멘트,철강,위험물질,수출업컨테이너)
 *
 * 2022. 01. 01.
 * 13: 퀵서비스 기사
 * 14: 대리운전 기사
 *
 * 2022. 07. 01.
 * 15: IT 소프트웨어 기술자
 * 16: 어린이 통학버스 기사
 * 17: 골프장 캐디
 * 18: 관공통역 안내사
 * 19: 화물차주 (유통배송기사, 택배 지간선기사, 특정품목운송차주) *
 *
 */

/**
 *
 * 불인정 사유
 * 0: 신청일이 이직일로 부터 1년을 초과함
 * 1: 퇴사일이 입사일보다 빠름
 * 2: 피보험단위기간이 부족함
 * 3: 예술인 또는 특고로 3개월 이상 근무하지 않음
 * 4: 단기 예술인 또는 단기 특고로 3개월 이상 근무하지 않음
 * 5: 단기 예술인 또는 단기 특고 최근 근로일 정보에서 1달 내에 10일 이상 근로 내역이 있고 14일 이내에 한번이라도 근로 내역이 있음
 * 6: 초단시간에서 주 근로일수가 2일을 초과함
 * 7: 초단시간에서 주 근무시간이 15시간 이상임
 * 8: 자영업자에서 최소 1년간 고용보험에 보험료를 납부하지 않음
 * 9: 복수형에서 마지막 근로형태가 불규칙임
 * 10: 복수형에서 이중취득 조건으로 수급 불인정 판단을 받음
 *
 */

export const DefineParamInfo = {
	retired: {
		// 퇴사여부
		type: "boolean",
	},
	severancePay: {
		// 퇴직금
		type: "number",
		minimum: 0,
	},
	salary: {
		// 월급
		type: "array",
		items: {
			type: "number",
			minimum: 0,
			maximum: 9999999999,
		},
		minItems: 1,
		maxItems: 3,
	},
	workCate: {
		// 근로형태
		type: "number",
		minimum: 0,
		maximum: 8,
	},
	retireReason: {
		// 퇴직사유
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
	enterDay: {
		// 입사일
		type: "string",
	},
	retiredDay: {
		// 퇴사일
		type: "string",
	},
	birth: {
		// 생일
		type: "string",
	},
	disabled: {
		// 장애여부
		type: "boolean",
	},
	weekDay: {
		// 근무요일
		type: "array",
		items: {
			type: "number",
		},
		maxItems: 7,
	},
	dayWorkTime: {
		type: "number",
		minimum: 4,
		maximum: 8,
	},
	isShort: {
		type: "boolean",
	},
	lastWorkDay: {
		type: "string",
	},
	workRecord: {
		type: "array",
		items: {
			type: "object",
		},
	},
};

export const DefinedParamErrorMesg: { [col_: string]: string } = {
	birth: "생년월일을 입력해 주세요",
	disabled: "장애여부를 선택해 주세요",
	enterDay: "입사일 및 퇴사일을 입력해 주세요",
	retiredDay: "입사일 및 퇴사일을 입력해 주세요",
	ealryRetire: "퇴사일이 입사일보다 빠릅니다.",
	salary: "월 급여를 입력해 주세요",
	expire: "실업급여는 퇴직한 다음날부터 12개월이 경과하면	지급 받을 수 없습니다.",
};

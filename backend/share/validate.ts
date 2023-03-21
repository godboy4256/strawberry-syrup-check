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
 * 6: 대여제품 방문점검원
 * 7: 가전제품 배송 설치기사
 * 8: 방문판매원
 * 9: 건설기계조종사
 * 10: 방과후학교 강사 *
 * 11: 화물차주 (시멘트,철강,위험물질,수출업컨테이너)
 *
 * 2022. 01. 01.
 * 12: 퀵서비스 기사
 * 13: 대리운전 기사
 *
 * 2022. 07. 01.
 * 14: IT 소프트웨어 기술자
 * 15: 어린이 통학버스 기사
 * 16: 골프장 캐디
 * 17: 관공통역 안내사
 * 18: 화물차주 (유통배송기사, 택배 지간선기사, 특정품목운송차주) *
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
 * 5: 단기 예술인, 단기 특고, 일용직 최근 근로일 정보에서 1달 내에 10일 이상 근로 내역이 있고 14일 이내에 한번이라도 근로 내역이 있음
 * 6: 초단시간에서 주 근로일수가 2일을 초과함
 * 7: 초단시간에서 주 근무시간이 15시간 이상임
 * 8: 자영업자에서 최소 1년간 고용보험에 보험료를 납부하지 않음
 * 9: 복수형에서 마지막 근로형태가 불규칙임
 * 10: 복수형에서 이중취득 조건으로 수급 불인정 판단을 받음
 * 11: 일용직 최근 근로일 정보에 1달 내에 10일 이상 근로 내역이 있음
 *
 */

export const DefineParamInfo = {
	/**퇴사여부*/
	retired: {
		type: "boolean",
	},
	/**만나이 */
	age: {
		type: "number",
		minimum: 0,
		maximum: 200,
	},
	/**퇴직금 */
	severancePay: {
		type: "number",
		minimum: 0,
	},
	/**급여 */
	salary: {
		type: "array",
		items: {
			type: "number",
			minimum: 0,
			maximum: 9999999999,
		},
		minItems: 1,
		maxItems: 3,
	},
	/**근로형태 */
	workCate: {
		type: "number",
		minimum: 0,
		maximum: 8,
	},
	/**퇴직사유 */
	retireReason: {
		type: "number",
		minimum: 0,
		maximum: 12,
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
	/**입사일 */
	enterDay: {
		type: "string",
		pattern: "^(d{4})-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$",
	},
	/**퇴사일 */
	retiredDay: {
		type: "string",
		pattern: "^(d{4})-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$",
	},
	/**근로일수 */
	workingDays: {
		type: "number",
	},
	/**부족근로일수 */
	requireDays: {
		type: "number",
	},
	/**근로월수 */
	workingMonths: {
		type: "number",
	},
	/**부족근로월수 */
	requireMonths: {
		type: "number",
	},

	/**장애여부 */
	disabled: {
		type: "boolean",
	},
	/**근무요일 */
	weekDay: {
		type: "array",
		items: {
			type: "number",
			mnimum: 0,
			maximum: 6,
		},
		maxItems: 7,
	},
	/**일 소정근로시간 */
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
	// workRecord: {
	// 	type: "array",
	// 	items: {
	// 		type: "object",
	// 	},
	// },
	/**실업급여 신청 근로의 퇴직일을 기준으로 계산한 피보험단위기간 계산 기한 */
	limitDay: {
		type: "string",
		pattern: "^(d{4})-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$",
	},
	/**복수형 여부 */
	isMany: {
		type: "boolean",
	},
	/**수급 인정/불인정 여부 */
	succ: {
		type: "boolean",
	},
	errorCode: {
		type: "number",
		minimum: 0,
		maximum: 11,
	},
	mesg: {
		type: "string",
	},
	/**일 수령액 */
	realDayPay: {
		type: "number",
		minimum: 0,
	},
	/**월 수령액 */
	realMonthPay: {
		type: "number",
	},
	/**기초일액 */
	dayAvgPay: {
		type: "number",
		minimum: 0,
	},
	/**limitDay 기한 내에 피보험기간(복수형에서 사용)  */
	workDayForMulti: {
		type: "number",
	},
	/**실업급여 수령 총액 */
	amountCost: {
		type: "number",
		minimum: 0,
	},
	/**소정급여일수 */
	receiveDay: {
		type: "number",
		minimum: 120,
		maximum: 270,
	},
	/**다음단계 수급을 위해서 필요한 근로일수 */
	needDay: {
		type: "number",
	},
	/**다음단계 수급 조건 예상 만족일 */
	availableDay: {
		type: "string",
	},
	/**다음단계 수급 시 현재 수령액과 비교하여 더 받는 금액 */
	morePay: {
		type: "number",
	},
	/**특고 직종 */
	jobCate: {
		type: "number",
		minimum: 0,
		maximum: 18,
	},
	/**특고 여부 */
	isSpecial: {
		type: "boolean",
	},
	/**실업급여 신청일 */
	enrollDay: {
		type: "string",
		pattern: "^(d{4})-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$",
	},
	/**퇴직 전 12개월 급여 총액 */
	sumOneYearPay: { type: "number", minimum: 0 },
	/**퇴직 전 24개월 피보험단위기간*/
	sumTwoYearWorkDay: {
		type: "number",
		minimum: 0,
	},
	/**피보험기간 */
	sumWorkDay: {
		type: "number",
		minimum: 0,
	},
	/**결과만입력 여부 */
	isSimple: {
		type: "boolean",
	},
	/**신청일 이전 1달 간 근로일수 10일 미만 여부 */
	isOverTen: {
		type: "boolean",
	},
	/**신청일 이전 14일간 연속근로 여부 */
	hasWork: {
		type: "boolean",
	},
};

export const DefinedParamErrorMesg = {
	birth: "생년월일을 입력해 주세요",
	disabled: "장애여부를 선택해 주세요",
	enterDay: "입사일 및 퇴사일을 입력해 주세요",
	retiredDay: "입사일 및 퇴사일을 입력해 주세요",
	ealryRetire: "퇴사일이 입사일보다 빠릅니다.",
	salary: "월 급여를 입력해 주세요",
	expire: "수급기간(퇴직 후 1년)이 경과하면 실업급여가 지급되지 않습니다.",
	isOverTen: "신청일 이전 1달 간 근로일수가 10일 미만이어야 합니다.",
	hasWork: "신청일 이전 14일간 연속근로내역이 없어야 합니다.",
	needArtorSpecialCareer: "예술인/특고로 3개월 이상 근무해야합니다.",
	needShortArtCareer: "단기 예술인으로 3개월 이상 근무해야합니다.",
};

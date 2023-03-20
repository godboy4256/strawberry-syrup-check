import { Dayjs } from "dayjs";
import { DefineParamInfo } from "../../share/validate";

export type TstandardInput = {
	retired: boolean;
	workCate: number;
	retireReason: number;
	age: number;
	disabled: boolean;
	enterDay: Dayjs;
	retiredDay: Dayjs;
	weekDay: number[];
	dayWorkTime: number;
	salary: number[];
	limitDay: string;
	isMany: boolean;
};

export type TartInput = {
	retired: boolean;
	workCate: number;
	jobCate?: number;
	retireReason: number;
	age: number;
	disabled: boolean;
	enterDay: Dayjs;
	retiredDay: Dayjs;
	sumTwelveMonthSalary: number[];
	isSpecial: boolean;
	limitDay: string;
	isMany: boolean;
};

export type TartShortInput = {
	retired: boolean;
	workCate: number;
	jobCate?: number;
	retireReason: number;
	age: number;
	disabled: boolean;
	lastWorkDay: string;
	enrollDay?: string;
	sumOneYearPay: number;
	sumTwoYearWorkDay?: number;
	sumWorkDay: number;
	isSpecial: boolean;
	isSimple: boolean;
	isOverTen: boolean;
	hasWork: boolean;
	limitDay: string;
	isMany: boolean;
};

export type TspecialShortInput = {
	retired: boolean;
	workCate: number;
	jobCate: number;
	retireReason: number;
	age: number;
	disabled: boolean;
	lastWorkDay: string;
	enrollDay?: string;
	sumOneYearPay: number;
	sumTwoYearWorkDay?: number;
	sumWorkDay: number;
	isSpecial: boolean;
	isSimple: boolean;
	isOverTen: boolean;
	hasWork: boolean;
	limitDay: string;
	isMany: boolean;
};

export type TdayJobInput = {
	retired: boolean;
	workCate: number;
	retireReason: number;
	age: number;
	disabled: boolean;
	isSpecial: boolean;
	lastWorkDay: Dayjs;
	enrollDay?: string;
	dayWorkTime: number;
	workRecord?: object[];
	dayAvgPay: number;
	sumWorkDay: number;
	isSimple: boolean;
	isOverTen: boolean;
	hasWork: boolean;
	limitDay: string;
	isMany: boolean;
};

export type TveryShortInput = {
	retired: boolean;
	age: number;
	disabled: boolean;
	enterDay: Dayjs;
	retiredDay: Dayjs;
	weekDay: number[]; // 주의
	weekWorkTime: number;
	salary: number[];
	limitDay: string;
	isMany: boolean;
};

const standardBodyProp = {
	retired: DefineParamInfo.retired,
	workCate: DefineParamInfo.workCate,
	retireReason: DefineParamInfo.retireReason,
	age: { type: "number" },
	disabled: DefineParamInfo.disabled,
	enterDay: DefineParamInfo.enterDay,
	retiredDay: DefineParamInfo.retiredDay,
	weekDay: DefineParamInfo.weekDay, // 주의
	dayWorkTime: DefineParamInfo.dayWorkTime,
	salary: DefineParamInfo.salary,
	limitDay: { type: "string" },
	isMany: { type: "boolean" },
};

const standardResponse = {
	400: {
		description: "신청일이 퇴직일부터 1년 초과 또는,\n\n입사일이 퇴사일보다 빠름",
		type: "object",
		properties: {
			succ: { type: "boolean" },
			errorCode: { type: "number" },
			mesg: { type: "string" },
		},
		examples: [
			{
				succ: false,
				errorCode: 0,
				mesg: "실업급여는 퇴직한 다음날부터 12개월이 경과하면\t지급 받을 수 없습니다.",
			},
			{
				succ: false,
				errorCode: 1,
				mesg: "퇴사일이 입사일보다 빠릅니다.",
			},
		],
	},
	202: {
		description: "수급 불인정",
		type: "object",
		properties: {
			succ: { type: "boolean" },
			errorCode: { type: "number" },
			retired: { type: "boolean" }, // 퇴직자/퇴직예정자
			workingDays: { type: "number" },
			requireDays: { type: "number" },
			realDayPay: { type: "number" },
			dayAvgPay: { type: "number" },
			workDayForMulti: { type: "number" },
		},
		examples: [
			{
				succ: false,
				errorCode: 2,
				retired: true,
				workingDays: 48,
				requireDays: 132,
				realDayPay: 61568,
				dayAvgPay: 66667,
				workDayForMulti: 48,
			},
		],
	},
	200: {
		description: "수급 인정",
		type: "object",
		properties: {
			succ: { type: "boolean" },
			retired: { type: "boolean" },
			amountCost: { type: "number" },
			dayAvgPay: { type: "number" },
			realDayPay: { type: "number" },
			receiveDay: { type: "number" },
			realMonthPay: { type: "number" },
			severancePay: { type: "number" },
			workingDays: { type: "number" },
			workDayForMulti: { type: "number" },
			needDay: { type: "number" }, // 다음 단계 수급
			availableDay: { type: "string" }, // 다음 단계 수급
			nextAmountCost: { type: "number" }, // 다음 단계 수급
			morePay: { type: "number" }, // 다음 단계 수급
		},
		examples: [
			{
				succ: true,
				retired: true,
				amountCost: 14776320,
				dayAvgPay: 66667,
				realDayPay: 61568,
				receiveDay: 240,
				realMonthPay: 1847040,
				severancePay: 20054895,
				workingDays: 401,
				workDayForMulti: 284,
			},
			{
				succ: true,
				retired: true,
				amountCost: 9235200,
				dayAvgPay: 66667,
				realDayPay: 61568,
				receiveDay: 150,
				realMonthPay: 1847040,
				severancePay: 4043856,
				workingDays: 401,
				needDay: 357,
				availableDay: "2025-4-28",
				nextAmountCost: 11082240,
				morePay: 1847040,
				workDayForMulti: 284,
			},
		],
	},
};

const artBodyProp = {
	retired: DefineParamInfo.retired,
	workCate: DefineParamInfo.workCate,
	jobCate: { type: "number", minimum: 0, maximum: 19 },
	retireReason: DefineParamInfo.retireReason,
	age: { type: "number" },
	disabled: DefineParamInfo.disabled,
	enterDay: DefineParamInfo.enterDay,
	retiredDay: DefineParamInfo.retiredDay,
	sumTwelveMonthSalary: DefineParamInfo.salary,
	isSpecial: { type: "boolean" },
	limitDay: { type: "string" },
	isMany: { type: "boolean" },
};

const shortArtBodyProp = {
	retired: DefineParamInfo.retired, // 퇴직여부
	workCate: DefineParamInfo.workCate, // 근로형태
	jobCate: { type: "number", minimum: 0, maximum: 18 },
	retireReason: DefineParamInfo.retireReason, // 퇴직사유
	age: { type: "number" },
	disabled: DefineParamInfo.disabled, // 장애여부
	lastWorkDay: DefineParamInfo.lastWorkDay, // 마지막 근무일
	enrollDay: { type: "string" },
	sumOneYearPay: { type: "number", minimum: 0 }, // 퇴직 전 12개월 급여 총액
	sumTwoYearWorkDay: { type: "number", minimum: 0 },
	sumWorkDay: { type: "number", minimum: 0 }, // 마지막 근무일
	isSpecial: { type: "boolean" },
	isSimple: { type: "boolean" },
	isOverTen: { type: "boolean" },
	hasWork: { type: "boolean" },
	limitDay: { type: "string" },
	isMany: { type: "boolean" },
};

const shortSepcialBodyProp = {
	retired: DefineParamInfo.retired, // 퇴직여부
	workCate: DefineParamInfo.workCate, // 근로형태
	jobCate: { type: "number", minimum: 0, maximum: 18 },
	retireReason: DefineParamInfo.retireReason, // 퇴직사유
	age: { type: "number" },
	disabled: DefineParamInfo.disabled, // 장애여부
	lastWorkDay: DefineParamInfo.lastWorkDay, // 마지막 근무일
	enrollDay: { type: "string" },
	sumOneYearPay: { type: "number", minimum: 0 }, // 퇴직 전 12개월 급여 총액
	sumTwoYearWorkDay: { type: "number", minimum: 0 },
	sumWorkDay: { type: "number", minimum: 0 }, // 마지막 근무일
	isSpecial: { type: "boolean" },
	isSimple: { type: "boolean" },
	isOverTen: { type: "boolean" },
	hasWork: { type: "boolean" },
	limitDay: { type: "string" },
	isMany: { type: "boolean" },
};

const dayJobBodyProp = {
	retired: DefineParamInfo.retired, // 퇴직여부
	workCate: DefineParamInfo.workCate, // 근로형태
	retireReason: DefineParamInfo.retireReason, // 퇴직사유
	age: { type: "number", minimum: 0 },
	disabled: DefineParamInfo.disabled, // 장애여부
	isSpecial: { type: "boolean" }, // 건설직 여부
	lastWorkDay: DefineParamInfo.lastWorkDay, // 마지막 근무일
	enrollDay: { type: "string" }, // 신청 예정일
	dayWorkTime: DefineParamInfo.dayWorkTime, // 소정 근로시간
	isSimple: { type: "boolean" },
	dayAvgPay: { type: "number", minimum: 0 },
	sumWorkDay: { type: "number", minimum: 0 },
	isOverTen: { type: "boolean" },
	hasWork: { type: "boolean" },
	limitDay: { type: "string" },
	isMany: { type: "boolean" },
};

const veryShortBodyProp = {
	retired: DefineParamInfo.retired,
	age: { type: "number", minimum: 0 },
	disabled: DefineParamInfo.disabled,
	enterDay: DefineParamInfo.enterDay,
	retiredDay: DefineParamInfo.retiredDay,
	weekDay: DefineParamInfo.weekDay, // 주의
	weekWorkTime: { type: "number", minimum: 1, maximum: 14 },
	salary: DefineParamInfo.salary,
	limitDay: { type: "string" },
	isMany: { type: "boolean" },
};

const employerBodyProp = {
	enterDay: DefineParamInfo.enterDay,
	retiredDay: DefineParamInfo.retiredDay,
	insuranceGrade: {
		type: "object",
	},
	limitDay: { type: "string" },
	isMany: { type: "boolean" }, // 복수형 여부
};

const employerBodyExamples = [
	{
		enterDay: "2020-01-01",
		retiredDay: "2022-10-01",
		insuranceGrade: { 2022: 1, 2021: 2, 2020: 1 },
		isEnd: false,
		limitDay: "2020-10-01",
		isMany: false,
	},
];

export const standardSchema = {
	schema: {
		tags: ["detail"],
		summary: "정규직/기간제",
		body: {
			type: "object",
			required: [
				"retired",
				"workCate",
				"retireReason",
				"age",
				"disabled",
				"enterDay",
				"retiredDay",
				"weekDay",
				"dayWorkTime",
				"salary",
				"limitDay",
			],
			properties: standardBodyProp,
		},
		response: standardResponse,
	},
};

export const artSchema = {
	schema: {
		tags: ["detail"],
		summary: "예술인/특고",
		body: {
			type: "object",
			required: [
				"retired",
				"workCate",
				"retireReason",
				"age",
				"disabled",
				"enterDay",
				"retiredDay",
				"sumTwelveMonthSalary",
				"isSpecial",
				"limitDay",
			],
			properties: artBodyProp,
		},
	},
};

export const shortArtSchema = {
	schema: {
		tags: ["detail"],
		summary: "단기 예술인",
		body: {
			type: "object",
			required: ["age", "disabled", "lastWorkDay", "hasWork", "isSimple", "limitDay"],
			properties: shortArtBodyProp,
		},
	},
};
export const shortSpecialSchema = {
	schema: {
		tags: ["detail"],
		summary: "단기 특고",
		body: {
			type: "object",
			required: ["age", "disabled", "lastWorkDay", "hasWork", "isSimple", "limitDay"],
			properties: shortSepcialBodyProp,
		},
	},
};

export const dayJobSchema = {
	schema: {
		tags: ["detail"],
		summary: "일용직",
		body: {
			type: "object",
			required: [
				"age",
				"disabled",
				"isSpecial",
				"lastWorkDay",
				"dayAvgPay",
				"sumWorkDay",
				"isOverTen",
				"hasWork",
				"limitDay",
			],
			properties: dayJobBodyProp,
		},
	},
};

export const veryShortSchema = {
	schema: {
		tags: ["detail"],
		summary: "초단시간",
		body: {
			type: "object",
			required: [
				"retired",
				"age",
				"disabled",
				"enterDay",
				"retiredDay",
				"weekDay",
				"weekWorkTime",
				"salary",
				"limitDay",
			],
			properties: veryShortBodyProp,
		},
	},
};

export const employerSchema = {
	schema: {
		tags: ["detail"],
		summary: "자영업",
		body: {
			type: "object",
			required: ["enterDay", "retiredDay", "insuranceGrade", "limitDay", "isMany"],
			properties: employerBodyProp,
			examples: employerBodyExamples,
		},
	},
};

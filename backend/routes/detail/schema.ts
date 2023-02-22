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
		summary: "정규직/자영업",
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

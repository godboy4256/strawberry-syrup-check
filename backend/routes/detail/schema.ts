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

	isEnd: boolean;
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
	isEnd: boolean;
	limitDay: string;
	isMany: boolean;
};

export type TartShortInput = {
	retired: boolean;
	workCate: number;
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
	isEnd: boolean;
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
	isEnd: boolean;
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
	isEnd: { type: "boolean" }, // 복수형 여부
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
	isEnd: { type: "boolean" },
	limitDay: { type: "string" },
};

const shortArtBodyProp = {
	retired: DefineParamInfo.retired, // 퇴직여부
	workCate: DefineParamInfo.workCate, // 근로형태
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
	isEnd: { type: "boolean" },
	limitDay: { type: "string" },
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
	isEnd: { type: "boolean" },
	limitDay: { type: "string" },
};

const employerBodyProp = {
	enterDay: DefineParamInfo.enterDay,
	retiredDay: DefineParamInfo.retiredDay,
	insuranceGrade: {
		type: "object",
	},
	isEnd: { type: "boolean" },
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
			],
			properties: standardBodyProp,
		},
	},
};

export const artSchema = {
	schema: {
		tags: ["detail"],
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
			],
			properties: artBodyProp,
		},
	},
};

export const shortArtSchema = {
	schema: {
		tags: ["detail"],
		body: {
			type: "object",
			required: ["age", "disabled", "lastWorkDay", "hasWork", "isSimple"],
			properties: shortArtBodyProp,
		},
	},
};

export const dayJobSchema = {
	schema: {
		tags: ["detail"],
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
			],
			properties: dayJobBodyProp,
		},
	},
};

export const veryShortSchema = {
	schema: {
		tags: ["detail"],
		body: {
			type: "object",
			required: ["retired", "age", "disabled", "enterDay", "retiredDay", "weekDay", "weekWorkTime", "salary"],
			properties: veryShortBodyProp,
		},
	},
};

export const employerSchema = {
	schema: {
		tags: ["detail"],
		body: {
			type: "object",
			required: ["enterDay", "retiredDay", "insuranceGrade", "isEnd", "limitDay", "isMany"],
			properties: employerBodyProp,
			examples: employerBodyExamples,
		},
	},
};

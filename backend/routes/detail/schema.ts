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
};

export type TartInput = {
	retired: boolean;
	workCate: number;
	jobCate: number;
	retireReason: number;
	age: number;
	disabled: boolean;
	enterDay: Dayjs;
	retiredDay: Dayjs;
	sumTwelveMonthSalary: number[];

	isSpecial: boolean;

	isEnd: boolean;
	limitDay: string;
};

export type TdayJobInput = {
	retired: boolean;
	workCate: number;
	retireReason: number;
	age: number;
	disable: boolean;
	isSpecial: boolean;
	lastWorkDay: Dayjs;
	dayWorkTime: number;
	workRecord?: object[];
	dayAvgPay: number;
	sumWorkDay: number;
	isOverTen: boolean;
	hasWork: [boolean, string];
};

export type TveryShortInput = {
	age: number;
	disable: boolean;
	enterDay: Dayjs;
	retiredDay: Dayjs;
	weekDay: number[]; // 주의
	dayWorkTime: number;
	salary: number[];
	isEnd: boolean;
	limitDay: string;
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
	//////////////////////////////////////////////////////////////////////
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
	// workRecord: { type: "array", items: { type: "string" } }, // ["2020-02-01", "2021-10-12"]
	isSpecial: { type: "boolean" },
	isEnd: { type: "boolean" },
	limitDay: { type: "string" },
};

const shortArtBodyProp = {
	retired: DefineParamInfo.retired, // 퇴직여부
	workCate: DefineParamInfo.workCate, // 근로형태
	retireReason: DefineParamInfo.retireReason, // 퇴직사유
	enterDay: DefineParamInfo.enterDay,
	age: { type: "number" },
	disable: DefineParamInfo.disabled, // 장애여부
	lastWorkDay: DefineParamInfo.lastWorkDay, // 마지막 근무일
	// workRecord: DefineParamInfo.workRecord,
	sumOneYearPay: { type: "number", minimum: 0 },
	sumOneYearWorkDay: { type: "number", minimum: 0 },
	sumTwoYearWorkDay: { type: "number", minimum: 0 },
	sumWorkDay: { type: "number", minimum: 0 },
	isSpecial: { type: "boolean" },
	isOverTen: { type: "boolean" },
	hasWork: { type: "array" },
	isEnd: { type: "boolean" },
	limitDay: { type: "string" },
};

const dayJobBodyProp = {
	retired: DefineParamInfo.retired, // 퇴직여부
	workCate: DefineParamInfo.workCate, // 근로형태
	retireReason: DefineParamInfo.retireReason, // 퇴직사유
	age: { type: "number", minimum: 0 },
	disable: DefineParamInfo.disabled, // 장애여부
	isSpecial: { type: "boolean" }, // 건설직 여부
	lastWorkDay: DefineParamInfo.lastWorkDay, // 마지막 근무일
	dayWorkTime: DefineParamInfo.dayWorkTime, // 소정 근로시간
	workRecord: DefineParamInfo.workRecord,
	dayAvgPay: { type: "number", minimum: 0 },
	sumWorkDay: { type: "number", minimum: 0 },
	isOverTen: { type: "boolean" },
	hasWork: { type: "array" },
};

const veryShortBodyProp = {
	age: { type: "number", minimum: 0 },
	disable: DefineParamInfo.disabled,
	enterDay: DefineParamInfo.enterDay,
	retiredDay: DefineParamInfo.retiredDay,
	weekDay: DefineParamInfo.weekDay, // 주의
	dayWorkTime: DefineParamInfo.weekWorkTime,
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
};

const employerBodyExamples = [
	{
		enterDay: "2020-01-01",
		retiredDay: "2022-10-01",
		insuranceGrade: { 2022: 1, 2021: 2, 2020: 1 },
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
				"jobCate",
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
			required: ["age", "disable", "lastWorkDay", "hasWork"],
			properties: shortArtBodyProp,
		},
	},
};

export const dayJobSchema = {
	schema: {
		tags: ["detail"],
		body: {
			type: "object",
			required: ["age", "disable", "isSpecial", "lastWorkDay", "dayAvgPay", "sumWorkDay", "isOverTen", "hasWork"],
			properties: dayJobBodyProp,
		},
	},
};

export const veryShortSchema = {
	schema: {
		tags: ["detail"],
		body: {
			type: "object",
			required: ["age", "disable", "enterDay", "retiredDay", "weekDay", "dayWorkTime", "salary"],
			properties: veryShortBodyProp,
		},
	},
};

export const employerSchema = {
	schema: {
		tags: ["detail"],
		body: {
			type: "object",
			required: ["enterDay", "retiredDay", "insuranceGrade"],
			properties: employerBodyProp,
			examples: employerBodyExamples,
		},
	},
};

import dayjs from "dayjs";

import { DefineParamInfo } from "../../share/validate";

const multiBodyProp = {
	mainData: {
		type: "object",
		required: ["workCate", "enterDay", "retiredDay", "workingDays", "age", "disabled", "dayAvgPay", "realDayPay"],
		properties: {
			workCate: DefineParamInfo.workCate,
			isIrregular: { type: "boolean" },
			enterDay: DefineParamInfo.enterDay,
			retiredDay: DefineParamInfo.retiredDay,
			workingDays: { type: "number", minimum: 0 },
			age: { type: "number", minimum: 0 },
			disabled: DefineParamInfo.disabled,
			dayAvgPay: { type: "number", minimum: 0 },
			realDayPay: { type: "number", minimum: 0 },
		},
	},
	addData: {
		type: "array",
		items: {
			type: "object",
			required: ["workCate", "enterDay", "retiredDay", "workingDays", "permitDays"],
			properties: {
				workCate: DefineParamInfo.workCate,
				isIrregular: { type: "boolean" },
				enterDay: DefineParamInfo.enterDay,
				retiredDay: DefineParamInfo.retiredDay,
				workingDays: { type: "number", minimum: 0 },
				permitDays: { type: "number", minimum: 0 },
			},
		},
		minItems: 1,
		maxItems: 10,
	},
};
const multiBodyExamples = [
	{
		mainData: {
			workCate: 1,
			isIrregular: false,
			enterDay: "2021-12-01",
			retiredDay: "2022-12-22",
			workingDays: 180,
			age: 29,
			disabled: false,
			dayAvgPay: 60000,
			realDayPay: 60000,
		},
		addData: [
			{
				workCate: 1,
				isIrregular: false,
				enterDay: "2021-01-01",
				retiredDay: "2021-04-15",
				workingDays: 200,
				permitDays: 110,
			},
			{
				workCate: 2,
				isIrregular: false,
				enterDay: "2020-03-23",
				retiredDay: "2020-12-31",
				workingDays: 200,
				permitDays: 1500,
			},
			{
				workCate: 3,
				isIrregular: false,
				enterDay: "2010-02-11",
				retiredDay: "2013-12-31",
				workingDays: 100,
				permitDays: 180,
			},
		],
	},
];

const multiResponse = {
	204: {
		description:
			"mainData의 정보만 사용할 수 있는 경우 상태 코드 204를 리턴한다.\n\n상세형 계산의 결과를 그대로 사용한다.",
		type: "object",
		properties: {
			succ: { type: "boolean" },
			mesg: { type: "string" },
		},
		examples: [{ succ: true, mesg: "" }],
	},
};

export const multiSchema = {
	schema: {
		tags: ["multi"],
		description: `mainData는 가장 최근 근무한 직장과 관련된 정보\n\naddData는 나머지 직장과 관련된 정보\n\nisIrregular는 정보의 입력을 개별입력으로 받았는지 여부`,
		body: {
			type: "object",
			properties: multiBodyProp,
			examples: multiBodyExamples,
		},
		response: multiResponse,
	},
};

export type TmainData = {
	workCate: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	isIrregular: boolean;
	enterDay: string | dayjs.Dayjs;
	retiredDay: string | dayjs.Dayjs;
	workingDays: number;
	age: number;
	disabled: boolean;
	dayAvgPay: number;
	realDayPay: number;
};
export type TaddData = {
	workCate: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	isIrregular: boolean;
	enterDay: string | dayjs.Dayjs;
	retiredDay: string | dayjs.Dayjs;
	workingDays: number;
	permitDays: number;
};

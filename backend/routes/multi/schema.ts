import { DefineParamInfo } from "../../share/validate";

const multiBodyProp = {
	mainData: {
		type: "object",
		required: ["workCate", "enterDay", "retiredDay", "workingDays", "age", "disable", "dayAvgPay", "realDayPay"],
		properties: {
			workCate: DefineParamInfo.workCate,
			isIrregular: { type: "boolean" },
			enterDay: DefineParamInfo.enterDay,
			retiredDay: DefineParamInfo.retiredDay,
			workingDays: { type: "number", minimum: 0 },
			age: { type: "number", minimum: 0 },
			disable: DefineParamInfo.disabled,
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
			disable: false,
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

export const multiSchema = {
	schema: {
		tags: ["multi"],
		description: `mainData는 가장 최근 근무한 직장과 관련된 정보\n\naddData는 나머지 직장과 관련된 정보\n\nisIrregular는 정보의 입력을 개별입력으로 받았는지 여부`,
		body: {
			type: "object",
			properties: multiBodyProp,
			examples: multiBodyExamples,
		},
	},
};

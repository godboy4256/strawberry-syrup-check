import { Dayjs } from "dayjs";
import { DefineParamInfo } from "../../share/validate";

export type TmainData = {
	retired: boolean;
	enterDay: Dayjs;
	retiredDay: Dayjs;
	salary: number[];
};

const standardBodyProp = {
	retired: DefineParamInfo.retired,
	enterDay: DefineParamInfo.enterDay,
	retiredDay: DefineParamInfo.retiredDay,
	salary: DefineParamInfo.salary,
};

const standardBodyExamples = [
	{
		retired: true,
		enterDay: "2019-06-01",
		retiredDay: "2021-05-31",
		salary: [2500000],
	},
];

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
	200: {
		description: "수급 인정",
		type: "object",
		properties: {
			succ: { type: "boolean" },
			retired: { type: "boolean" },
			amountCost: { type: "number" },
			workingDays: { type: "number" },
			realDayPay: { type: "number" },
			receiveDay: { type: "number" },
			realMonthPay: { type: "number" },
			severancePay: { type: "number" },
		},
		examples: [
			{
				succ: true,
				retired: true,
				amountCost: 9018000,
				workingDays: 471,
				realDayPay: 60120,
				receiveDay: 150,
				realMonthPay: 1803600,
				severancePay: 5537277,
			},
		],
	},
	202: {
		description: "수급 불인정",
		type: "object",
		properties: {
			succ: { type: "boolean" },
			errorCode: { type: "number" },
			retired: { type: "boolean" },
			workingDays: { type: "number" },
			requireDays: { type: "number" },
			availableDay: { type: "string" },
			amountCost: { type: "number" },
			dayAvgPay: { type: "number" },
			realDayPay: { type: "number" },
			receiveDays: { type: "number" },
			realMonthPay: { type: "number" },
			workDayForMulti: { type: "number" },
		},
		examples: [
			{
				succ: false,
				errorCode: 2,
				retired: false,
				workingDays: 76,
				requireDays: 104,
				availableDay: "2023-4-29",
				amountCost: 7214400,
				dayAvgPay: 65218,
				realDayPay: 60120,
				receiveDays: 120,
				realMonthPay: 1803600,
			},
			{
				succ: false,
				errorCode: 2,
				retired: true,
				workingDays: 76,
				requireDays: 104,
				dayAvgPay: 65218,
				realDayPay: 60120,
			},
		],
	},
};

export const standardSchema = {
	schema: {
		tags: ["standard"],
		body: {
			type: "object",
			required: ["retired", "enterDay", "retiredDay", "salary"],
			properties: standardBodyProp,
			examples: standardBodyExamples,
		},
		response: standardResponse,
	},
};

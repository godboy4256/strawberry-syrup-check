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
		salary: 2500000,
	},
];

export const standardSchema = {
	schema: {
		tags: ["standard"],
		body: {
			type: "object",
			required: ["retired", "enterDay", "retiredDay", "salary"],
			properties: standardBodyProp,
			examples: standardBodyExamples,
		},
	},
};

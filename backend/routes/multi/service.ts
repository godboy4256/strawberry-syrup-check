import { requiredWorkingDay } from "../../data/data";
import { TaddData, TmainData } from "./schema";

export const doubleCasePermitCheck = (
	tempWoringDays: number,
	artWorkingMonths: number,
	specialWorkingMonths: number
) => {
	console.log(
		1 - Math.floor((tempWoringDays / 180) * 10) / 10,
		Math.floor((artWorkingMonths / 9) * 10) / 10 + Math.floor((specialWorkingMonths / 12) * 10) / 10
	);
	return (
		1 - Math.floor((tempWoringDays / 180) * 10) / 10 <=
		Math.floor((artWorkingMonths / 9) * 10) / 10 + Math.floor((specialWorkingMonths / 12) * 10) / 10
	);
};

export const commonCasePermitCheck = (permitAddCandidates: TaddData[], mainData: TmainData) => {
	const leastRequireWorkingDay = requiredWorkingDay[mainData.workCate];
	return (
		leastRequireWorkingDay > permitAddCandidates.reduce((acc, obj) => acc + obj.permitDays, mainData.workingDays)
	);
};

import dayjs from "dayjs";
import { requiredWorkingDay } from "../../../data/data";
import { TaddData, TmainData } from "../schema";

export const doubleCasePermitCheck = (
	tempWoringDays: number,
	artWorkingMonths: number,
	specialWorkingMonths: number,
	mainWorkCate: number
) => {
	let result: [boolean, number] = [false, 0];
	if (mainWorkCate === 2 || mainWorkCate === 4) {
		result[0] = artDoubleCheckFormula(tempWoringDays, artWorkingMonths, specialWorkingMonths);
		if (!result[0]) {
			result[1] = calRequireDays(tempWoringDays, artWorkingMonths, specialWorkingMonths, artDoubleCheckFormula);
		}
	} else if (mainWorkCate === 3 || mainWorkCate === 5) {
		result[0] = specialDoubleCheckFormula(tempWoringDays, artWorkingMonths, specialWorkingMonths);
		if (!result[0]) {
			result[1] = calRequireDays(
				tempWoringDays,
				artWorkingMonths,
				specialWorkingMonths,
				specialDoubleCheckFormula
			);
		}
	} else {
		result[0] = tempDoubleCheckFormula(tempWoringDays, artWorkingMonths, specialWorkingMonths);
		if (!result[0]) {
			result[1] = calRequireDays(tempWoringDays, artWorkingMonths, specialWorkingMonths, tempDoubleCheckFormula);
		}
	}

	return result;
};

export const commonCasePermitCheck = (permitAddCandidates: TaddData[], mainData: TmainData) => {
	const leastRequireWorkingDay = requiredWorkingDay[mainData.workCate];
	const permitWorkingDays = permitAddCandidates.reduce((acc, cur) => {
		if (cur.workCate === 4 || cur.workCate === 5) cur.permitDays = cur.permitDays * 30;
		return acc + cur.permitDays;
	}, mainData.workingDays);
	const result: [boolean, number] = [false, permitWorkingDays];
	result[0] = leastRequireWorkingDay <= permitWorkingDays;
	console.log("result: ", result);
	return result;
};

export const mergeWorkingDays = (mainData: TmainData, addDatas: (TmainData | TaddData)[]) => {
	addDatas.forEach((addData) => console.log(addData.workingDays));
	const workingDays = addDatas.reduce((acc, cur) => {
		return cur.workCate === 4 || cur.workCate === 5
			? acc + Math.floor(cur.workingDays * 30.4)
			: acc + cur.workingDays;
	}, mainData.workingDays);
	return workingDays;
};

const calRequireDays = (
	tempWoringDays: number,
	artWorkingMonths: number,
	specialWorkingMonths: number,
	iteratee: (arg0: number, arg1: number, arg2: number) => boolean
) => {
	let tempIncreasingVal = 0;
	while (!iteratee(tempWoringDays, artWorkingMonths, specialWorkingMonths)) {
		tempWoringDays++;
		tempIncreasingVal++;
	}
	return tempIncreasingVal;
};

const tempDoubleCheckFormula = (tempWoringDays: number, artWorkingMonths: number, specialWorkingMonths: number) => {
	return (
		1 - Math.floor((tempWoringDays / 180) * 10) / 10 <=
		Math.floor((artWorkingMonths / 9) * 10) / 10 + Math.floor((specialWorkingMonths / 12) * 10) / 10
	);
};
const artDoubleCheckFormula = (tempWoringDays: number, artWorkingMonths: number, specialWorkingMonths: number) => {
	return (
		1 - Math.floor((artWorkingMonths / 9) * 10) / 10 <=
		Math.floor((tempWoringDays / 180) * 10) / 10 + Math.floor((specialWorkingMonths / 12) * 10) / 10
	);
};
const specialDoubleCheckFormula = (tempWoringDays: number, artWorkingMonths: number, specialWorkingMonths: number) => {
	return (
		1 - Math.floor((specialWorkingMonths / 12) * 10) / 10 <=
		Math.floor((tempWoringDays / 180) * 10) / 10 + Math.floor((artWorkingMonths / 9) * 10) / 10
	);
};

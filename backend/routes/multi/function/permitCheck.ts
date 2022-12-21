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
			result.push(calRequireDays(tempWoringDays, artWorkingMonths, specialWorkingMonths, artDoubleCheckFormula));
		}
	} else if (mainWorkCate === 3 || mainWorkCate === 5) {
		result[0] = specialDoubleCheckFormula(tempWoringDays, artWorkingMonths, specialWorkingMonths);
		if (!result[0]) {
			result.push(
				calRequireDays(tempWoringDays, artWorkingMonths, specialWorkingMonths, specialDoubleCheckFormula)
			);
		}
	} else {
		result[0] = tempDoubleCheckFormula(tempWoringDays, artWorkingMonths, specialWorkingMonths);
		if (!result[0]) {
			result.push(calRequireDays(tempWoringDays, artWorkingMonths, specialWorkingMonths, tempDoubleCheckFormula));
		}
	}

	return result;
};

export const commonCasePermitCheck = (permitAddCandidates: TaddData[], mainData: TmainData) => {
	const leastRequireWorkingDay = requiredWorkingDay[mainData.workCate];
	const permitWorkingDays = permitAddCandidates.reduce((acc, obj) => acc + obj.permitDays, mainData.workingDays);
	const result: [boolean, number] = [false, permitWorkingDays];
	result[0] = leastRequireWorkingDay <= permitWorkingDays;
	return result;
};

export const mergeWorkingDays = (mainData: TmainData, addDatas: (TmainData | TaddData)[]) => {
	let workingDays = dayjs(mainData.retiredDay).diff(mainData.enterDay, "day");

	addDatas.map((addData, idx, addDatas) => {
		addData.enterDay = dayjs(addData.enterDay);
		addData.retiredDay = dayjs(addData.retiredDay);

		if (idx === 0) {
			mainData.enterDay = dayjs(mainData.enterDay);
			mainData.retiredDay = dayjs(mainData.retiredDay);

			if (addData.enterDay > mainData.enterDay) {
				if (addData.enterDay < mainData.retiredDay) {
					if (addData.retiredDay > mainData.retiredDay)
						workingDays += mainData.retiredDay.diff(addData.enterDay, "day");
				}
			}
			if (addData.enterDay < mainData.enterDay) {
				if (addData.retiredDay < mainData.retiredDay)
					workingDays += addData.retiredDay.diff(addData.enterDay, "day");
				if (addData.retiredDay > mainData.enterDay)
					workingDays += mainData.enterDay.diff(addData.enterDay, "day");
			}
		} else {
			for (let i = 1; i <= idx; i++) {
				const compareData = { ...addDatas[idx - i] };
				compareData.enterDay = dayjs(compareData.enterDay);
				compareData.retiredDay = dayjs(compareData.retiredDay);

				if (addData.enterDay > compareData.enterDay) {
					if (addData.enterDay < compareData.retiredDay) {
						if (addData.retiredDay > compareData.retiredDay)
							workingDays += compareData.retiredDay.diff(addData.enterDay, "day");
					}
				}
				if (addData.enterDay < compareData.enterDay) {
					if (addData.retiredDay < compareData.retiredDay)
						workingDays += addData.retiredDay.diff(addData.enterDay, "day");
					if (addData.retiredDay > compareData.enterDay)
						workingDays += compareData.enterDay.diff(addData.enterDay, "day");
				}
			}
		}
	});

	return workingDays;
};

const calRequireDays = (
	tempWoringDays: number,
	artWorkingMonths: number,
	specialWorkingMonths: number,
	iteratee: (arg0: number, arg1: number, arg2: number) => boolean
) => {
	let tempIncreasingVal = 0;
	while (iteratee(tempWoringDays, artWorkingMonths, specialWorkingMonths)) {
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

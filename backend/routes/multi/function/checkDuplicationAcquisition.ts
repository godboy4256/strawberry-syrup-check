import dayjs from "dayjs";
import { TaddData, TmainData } from "../schema";

const checkDuplicateAcquisition = (mainData: TmainData, permitAddCandidates: TaddData[]) => {
	let isDoubleAcquisition = false;
	const checkWorkCates = [2, 3, 4, 5];

	for (let i = 0; i < permitAddCandidates.length; i++) {
		if (
			permitAddCandidates[i].enterDay < mainData.enterDay &&
			permitAddCandidates[i].retiredDay > mainData.enterDay &&
			(checkWorkCates.includes(mainData.workCate) || checkWorkCates.includes(permitAddCandidates[i].workCate))
		)
			return (isDoubleAcquisition = true);

		if (
			permitAddCandidates[i].enterDay > mainData.enterDay &&
			permitAddCandidates[i].retiredDay < mainData.retiredDay &&
			(checkWorkCates.includes(mainData.workCate) || checkWorkCates.includes(permitAddCandidates[i].workCate))
		)
			return (isDoubleAcquisition = true);

		if (
			permitAddCandidates[i].enterDay > mainData.enterDay &&
			permitAddCandidates[i].retiredDay > mainData.retiredDay &&
			(checkWorkCates.includes(mainData.workCate) || checkWorkCates.includes(permitAddCandidates[i].workCate))
		)
			return (isDoubleAcquisition = true);
	}

	return isDoubleAcquisition;
};

export const getDuplicateAcquisitionInfo = (mainData: TmainData, permitAddCandidates: TaddData[]) => {
	let tempWorkCount = { count: 0, permitDays: 0 };
	let artWorkCount = { count: 0, permitMonths: 0 };
	let specialWorkCount = { count: 0, permitMonths: 0 }; // 특고

	const isDuplicateAcquisition = checkDuplicateAcquisition(mainData, permitAddCandidates);

	if (isDuplicateAcquisition) {
		const artWorkCates = [2, 4];
		const specialWorkCates = [3, 5];

		if (artWorkCates.includes(mainData.workCate)) artWorkCount.permitMonths += mainData.workingDays;
		else if (specialWorkCates.includes(mainData.workCate)) specialWorkCount.permitMonths += mainData.workingDays;
		else tempWorkCount.permitDays += mainData.workingDays;

		permitAddCandidates.forEach((permitAddCandidate) => {
			if (artWorkCates.includes(permitAddCandidate.workCate)) {
				artWorkCount.count++;
				artWorkCount.permitMonths += permitAddCandidate.permitDays;
			} else if (specialWorkCates.includes(permitAddCandidate.workCate)) {
				specialWorkCount.count++;
				specialWorkCount.permitMonths += permitAddCandidate.permitDays;
			} else {
				tempWorkCount.count++;
				tempWorkCount.permitDays += permitAddCandidate.permitDays;
			}
		});
	}

	return { isDuplicateAcquisition, tempWorkCount, artWorkCount, specialWorkCount };
};

export const makeAddCadiates = (addDatas: TaddData[], mainEnterDay: dayjs.Dayjs) => {
	const addCadiates: TaddData[] = [];
	for (let i = 0; i < addDatas.length; i++) {
		if (i === 0) {
			addCadiates.push(addDatas[i]);
		} else if (dayjs(addDatas[i - 1].enterDay).diff(addDatas[i].retiredDay, "day") <= 1095) {
			addCadiates.push(addDatas[i]);
		}
	}

	return addCadiates;
};

import { TaddData, TmainData } from "../schema";

const checkDuplicationDays = (mainData: TmainData, permitAddCandidates: TaddData[]) => {
	let isDuplicate = false;

	for (let i = 0; i < permitAddCandidates.length; i++) {
		if (
			permitAddCandidates[i].enterDay < mainData.enterDay &&
			permitAddCandidates[i].retiredDay > mainData.enterDay
		)
			isDuplicate = true;

		if (
			permitAddCandidates[i].enterDay > mainData.enterDay &&
			permitAddCandidates[i].retiredDay < mainData.retiredDay
		)
			isDuplicate = true;

		if (
			permitAddCandidates[i].enterDay > mainData.enterDay &&
			permitAddCandidates[i].retiredDay > mainData.retiredDay
		)
			isDuplicate = true;
	}

	for (let i = 0; i < permitAddCandidates.length; i++) {
		if (isDuplicate) break;
		for (let j = i + 1; j < permitAddCandidates.length; j++) {
			if (
				permitAddCandidates[j].enterDay < permitAddCandidates[i].enterDay &&
				permitAddCandidates[j].retiredDay > permitAddCandidates[i].enterDay
			)
				isDuplicate = true;
			if (
				permitAddCandidates[j].enterDay > permitAddCandidates[i].enterDay &&
				permitAddCandidates[j].retiredDay < permitAddCandidates[i].retiredDay
			)
				isDuplicate = true;
			if (
				permitAddCandidates[j].enterDay > permitAddCandidates[i].enterDay &&
				permitAddCandidates[j].retiredDay > permitAddCandidates[i].retiredDay
			)
				isDuplicate = true;
		}
	}

	return isDuplicate;
};

export const checkDuplicateAcquisition = (mainData: TmainData, permitAddCandidates: TaddData[]) => {
	let isDoubleAcquisition = false; // 이중취득 여부
	let tempWorkCount = { count: 0, permitDays: 0 };
	let artWorkCount = { count: 0, permitMonths: 0 };
	let specialWorkCount = { count: 0, permitMonths: 0 }; // 특고

	const artWorkCates = [2, 4];
	const specialWorkCates = [3, 5];

	permitAddCandidates.map((permitAddCandidate, idx, permitAddCandidates) => {
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

	const hasDuplicateDays = checkDuplicationDays(mainData, permitAddCandidates);

	if ((hasDuplicateDays && tempWorkCount.count >= 1 && artWorkCount.count >= 1) || specialWorkCount.count >= 1)
		isDoubleAcquisition = true;

	return { isDoubleAcquisition, tempWorkCount, artWorkCount, specialWorkCount };
};

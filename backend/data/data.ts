export const employerPayTable = {
	2018: {
		1: 1540000,
		2: 1730000,
		3: 1920000,
		4: 2110000,
		5: 2310000,
		6: 2500000,
		7: 2690000,
	},
	2019: {
		1: 1820000,
		2: 2080000,
		3: 2340000,
		4: 2600000,
		5: 2860000,
		6: 3120000,
		7: 3380000,
	},
};

export const permitRangeData = {
	0: 18,
	1: 18,
	2: 24,
	3: 24,
	4: 24,
	5: 24,
	6: 18,
	7: 24,
	8: 24,
};

export const requiredWorkingDay = {
	0: 180,
	1: 180,
	2: Math.floor(9 * 30.4),
	3: 365,
	4: 9, // 9 or 12 month => 단기 예술인, 단기 특고
	5: 12,
	6: 180, // 12 month 1 year
	7: 180, // 12 month 1 year
	8: 12, // 12 month 1 year
};

interface goodResult {
	succ: boolean;
	retired: boolean;
	amountCost: number;
	realDayPay: number;
	realMonthPay: number;
	receiveDay: number;
	severancePay: number;

	workingDays: number; // detail standard
	artWorkingDays: number; // detail art
}

interface goodResultNext {
	succ: boolean;
	retired: boolean;
	amountCost: number;
	realDayPay: number; // artRealDayPay
	realMonthPay: number; // artRealMonthPay
	receiveDay: number; //receiveDay
	severanvePay: number;

	workingDays: number; // detail, // artWorkingDays
	needDay: Date;
	nextAmountCost: number;
	morePay: number;
}

interface badResult {
	succ: boolean;
	retired: boolean;
	workingDays: number;
	requireDays: number; // needDays
}

interface badResult03 {
	avilableDay: number;
	amountCost: number;
	dayPay: number; // realDayPay
	receiveDays: number; // receiveDay
	monthPay: number; // realMonthDay
}

export const GetDateArr = (targetDate: Date | null) => {
	const date = targetDate ? new Date(targetDate) : new Date();
	return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
};

export const getAge = (birthdate?: Date) => {
	const today = new Date();
	const yearDiff = today.getFullYear() - birthdate.getFullYear();
	const monthDiff = today.getMonth() - birthdate.getMonth();
	const dateDiff = today.getDate() - birthdate.getDate();

	const isBeforeBirthDay = monthDiff < 0 || (monthDiff === 0 && dateDiff < 0);

	return {
		age: yearDiff + (isBeforeBirthDay ? -1 : 0),
		yearAge: yearDiff,
		countingAge: yearDiff + 1,
	};
};

export const Year_Option_Generater = () => {
	const year_arr = [];
	for (let j = 0; j < 10; j++) {
		year_arr.push(String(new Date().getFullYear() - j));
	}
	return year_arr;
};

export const Month_Calculator = (target_month: number, direction: string, how_much: number) => {
	let month_arr = [];
	if (direction === "before") {
		for (let i = 0; i < how_much; i++) {
			target_month = target_month - 1;
			if (target_month === 0) {
				target_month = 12;
			}
			month_arr.push(target_month);
		}
	} else {
		for (let i = 0; i < how_much; i++) {
			target_month = target_month + 1;
			if (target_month === 13) {
				target_month = 1;
			}
			month_arr.push(target_month);
		}
	}
	return month_arr;
};

export const One_Month_Ago = (targetDate: Date | null) => {
	const date = targetDate ? new Date(targetDate) : new Date();
	const oneMonthAgo = new Date(date.setMonth(date.getMonth() - 1));
	return [oneMonthAgo.getFullYear(), oneMonthAgo.getMonth() + 1, oneMonthAgo.getDate()];
};

export const GetCurrentDate = () => {
	const date = new Date();
	return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
};

export const getAge = (birthdate: Date) => {
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

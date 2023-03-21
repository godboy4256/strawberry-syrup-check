export const GetDateArr = (targetDate: Date | null | string) => {
  const date = targetDate ? new Date(targetDate) : new Date();
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
};

export const getAge = (birthdate?: Date) => {
  const today = new Date();
  const yearDiff = birthdate && today.getFullYear() - birthdate.getFullYear();
  const monthDiff = birthdate && today.getMonth() - birthdate.getMonth();
  const dateDiff = birthdate && today.getDate() - birthdate.getDate();
  const isBeforeBirthDay =
    (monthDiff && monthDiff < 0) ||
    (monthDiff === 0 && dateDiff && dateDiff < 0);
  return {
    age: yearDiff && yearDiff + (isBeforeBirthDay ? -1 : 0),
    yearAge: yearDiff,
    countingAge: yearDiff && yearDiff + 1,
  };
};

export const Year_Option_Generater = (count: number, max?: number) => {
  const year_arr = [];
  for (let i = 0; i < count; i++) {
    year_arr.push(String(max ? max : new Date().getFullYear() - i));
  }
  return year_arr;
};

export const Art_Year_Generater = () => {
  const year_arr = [];
  for (let i = 0; i < new Date().getFullYear(); i++) {
    year_arr.push(String(new Date().getFullYear() - i));
    if (new Date().getFullYear() - i === 2020) {
      break;
    }
  }
  return year_arr;
};

export const Month_Calculator = (
  target_month: number,
  direction: string,
  how_much: number
) => {
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
  return [
    oneMonthAgo.getFullYear(),
    oneMonthAgo.getMonth() + 1,
    oneMonthAgo.getDate(),
  ];
};

export const Get_Dates_InRange = (startDate: string, endDate: string) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const dateFormat = GetDateArr(new Date(currentDate));
    dates.push(`${dateFormat[0]}-${dateFormat[1]}-${dateFormat[2]}`);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const Get_Months_Between_Dates = (
  startDate: string,
  endDate: string
) => {
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  const startMonth = new Date(startDate).getMonth();
  const endMonth = new Date(endDate).getMonth();
  const months = [];
  for (let year = startYear; year <= endYear; year++) {
    const start = year === startYear ? startMonth : 0;
    const end = year === endYear ? endMonth : 11;
    for (let month = start; month <= end; month++) {
      const monthString = `${year}-${month + 1}`;
      months.push(monthString);
    }
  }
  return months;
};

export const Convert_To_Date_String = (record: any) => {
  const result = [];
  for (let yearRecord of record) {
    const year = yearRecord.year;
    for (let i = 0; i < 12; i++) {
      const month = i + 1;
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${month}-${day}`;
        const monthRecord = yearRecord.months.find(
          (m: any) => m.month === month
        );
        if (monthRecord) {
          result.push(dateStr);
        }
      }
    }
  }
  return result;
};

export const Convert_To_Motths_String = (record: any) => {
  const result = [];
  for (let i = 0; i < record.length; i++) {
    for (let j = 0; j < record[i].months.length; j++) {
      result.push(`${record[i].year}-${record[i].months[j].month}`);
    }
  }
  return result;
};

export const DetailPathCal = (workCate: number) => {
  if (workCate === 0 || workCate === 1) return "/detail/standard";
  else if (workCate === 2 || workCate === 3) return "/detail/art";
  else if (workCate === 4) return "/detail/art/short";
  else if (workCate === 5) return "/detail/special/short";
  else if (workCate === 6) return "/detail/dayjob";
  else if (workCate === 7) return "/detail/veryShort";
  else if (workCate === 8) return "/detail/employer";
};

const getWorkDaysAgoMonthArr = (lastWorkDay: string, agoNum: number) => {
  const arr = [];
  let lastWorkYear = new Date(lastWorkDay).getFullYear();
  let lastWorkMonth = new Date(lastWorkDay).getMonth() + 1;
  for (let i = 0; i < agoNum; i++) {
    if (lastWorkMonth < 1) {
      lastWorkMonth = 12;
      lastWorkYear--;
    }
    arr.push(`${lastWorkYear}-${lastWorkMonth}`);
    lastWorkMonth--;
  }
  return arr;
};

export const getTotalWorkDaysAgo = (
  lastWorkDay: string,
  workRecord: {
    year: number;
    months: { month: number; day: number; pay?: number }[];
  }[],
  agoNum: number
) => {
  const agoArr = getWorkDaysAgoMonthArr(lastWorkDay, agoNum);
  let days = 0;
  if (!workRecord) return;
  for (let i = 0; i < workRecord.length; i++) {
    for (let j = 0; j < workRecord[i].months.length; j++) {
      if (
        agoArr.includes(
          `${workRecord[i].year}-${workRecord[i].months[j].month}`
        )
      ) {
        days = days + workRecord[i].months[j].day;
      }
    }
  }
  return days;
};

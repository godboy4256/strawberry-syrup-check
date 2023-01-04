export const calRecording = (result: any, type: string, workCate?: string) => {
  const storageRecord = localStorage.getItem("cal_result");
  const calResult = storageRecord && JSON.parse(storageRecord);
  const toStorage: any = {
    id: calResult ? calResult.length : 0,
    createdAt: new Date(),
    calType: `${type}${workCate ? `(${workCate})` : ""}`,
    succ: result.succ ? "대상자" : "비대상자",
    workingDays: result.workingDays,
    monthPay: result.realMonthPay,
    receiveDay: result.receiveDay,
    amountCost: result.amountCost,
    severancePay: result.severancePay,
    severanceReason: result.severancePay ? null : "재직기간 1년 미만",
  };

  if (calResult) {
    calResult.push(toStorage);
    calResult && localStorage.setItem("cal_result", JSON.stringify(calResult));
  } else {
    const recordArr = [];
    recordArr.push(toStorage);
    localStorage.setItem("cal_result", JSON.stringify(recordArr));
  }
};

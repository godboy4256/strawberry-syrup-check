export const calRecording = (result: any, type: string, workCate?: string) => {
  const storageRecord = localStorage.getItem("cal_result");
  const calResult = storageRecord && JSON.parse(storageRecord);
  const disReason =
    result.errorCode === 0
      ? "신청일이 이직일로 부터 1년을 초과함"
      : result.errorCode === 1
      ? "퇴사일이 입사일보다 빠름"
      : result.errorCode === 2
      ? "피보험단위기간이 부족함"
      : result.errorCode === 3
      ? "예술인 또는 특고로 3개월 이상 근무하지 않음"
      : result.errorCode === 4
      ? "단기 예술인 또는 단기 특고로 3개월 이상 근무하지 않음"
      : result.errorCode === 5
      ? "단기 예술인 또는 단기 특고 최근 근로일 정보에서 1달 내에 10일 이상 근로 내역이 있고 14일 이내에 한번이라도 근로 내역이 있음"
      : result.errorCode === 6
      ? "초단시간에서 주 근로일수가 2일을 초과함"
      : result.errorCode === 7
      ? "초단시간에서 주 근무시간이 15시간 이상임"
      : result.errorCode === 8
      ? "자영업자에서 최소 1년간 고용보험에 보험료를 납부하지 않음"
      : result.errorCode === 9
      ? "복수형에서 마지막 근로형태가 불규칙임"
      : result.errorCode === 10 &&
        "복수형에서 이중취득 조건으로 수급 불인정 판단을 받음";

  const toStorage: any = {
    id: calResult ? calResult.length : 0,
    createdAt: new Date(),
    calType: `${type}${workCate ? `(${workCate})` : ""}`,
    succ: result.succ ? "대상자" : "비대상자",
    workingDays: result.workingDays ? result.workingDays : result.workingMonths,
    monthPay: result.realMonthPay,
    receiveDay: result.receiveDay,
    amountCost: result.amountCost,
    severancePay: result.severancePay,
    disReason,
    workCate,
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

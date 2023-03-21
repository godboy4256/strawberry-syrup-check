import { useSetRecoilState } from "recoil";
import {
  ageState,
  enterDayeState,
  hasWorkState,
  lastWorkDayState,
  planToDoState,
  retiredDayeState,
} from "../../assets/atom/date";
import { ClosePopup, CreatePopup } from "../common/popup";
import IMGResetIcon from "../../assets/image/new/reset_icon.svg";
import {
  NormalSalary,
  setDayAvgPay,
  setEmployMonth,
  setEmployYear,
  setSumOneYearPay,
  setSumWorkDay,
} from "../../assets/atom/pay";
import {
  dayWorkTimeSelectState,
  jobCateSelectState,
  normalSelectState,
} from "../../assets/atom/select";
import { weeKDayState } from "../../assets/atom/weekDay";
import {
  tabBelongArtIsShort,
  tabBelongSpecialIsShort,
  tabBelongInput,
  tabStateInputArt,
  tabStateIsShortsArt,
  tabStateSalary,
} from "../../assets/atom/tab";
import {
  SalaryTabInput01,
  SalaryTabInput02,
  SalaryTabInput03,
} from "../../assets/atom/pay";
import { useEffect } from "react";
import { disabledCheck, isSpecialCheck } from "../../assets/atom/checkbox";
import { workRecordState } from "../../assets/atom/workRecordGen";
import { setTimeCount } from "../../assets/atom/time";

const ResetButton = ({
  workCate,
  handler,
}: {
  workCate: number;
  handler: any;
}) => {
  const setAgeState = useSetRecoilState(ageState);
  const setEnterDayState = useSetRecoilState(enterDayeState);
  const setRetiredDayState = useSetRecoilState(retiredDayeState);
  const setLastWorkDayState = useSetRecoilState(lastWorkDayState);
  const setPlanToDoState = useSetRecoilState(planToDoState);
  const setNormalSalary = useSetRecoilState(NormalSalary);
  const setNormalSelect = useSetRecoilState(normalSelectState);
  const setHasWork = useSetRecoilState(hasWorkState);
  const setDayWorkTimeSelect = useSetRecoilState(dayWorkTimeSelectState);
  const setWeekDay = useSetRecoilState(weeKDayState);
  const setTabSalaryState = useSetRecoilState(tabStateSalary);
  const tabStateIsShortsArtState = useSetRecoilState(tabStateIsShortsArt);
  const tabStateInputArtState = useSetRecoilState(tabStateInputArt);
  const SalaryTabInputState01 = useSetRecoilState(SalaryTabInput01);
  const SalaryTabInputState02 = useSetRecoilState(SalaryTabInput02);
  const SalaryTabInputState03 = useSetRecoilState(SalaryTabInput03);
  const setTabStateIsShortArt = useSetRecoilState(tabBelongArtIsShort);
  const setTabStateIsShortSpecial = useSetRecoilState(tabBelongSpecialIsShort);
  const setTabStateInput = useSetRecoilState(tabBelongInput);
  const setDisbled = useSetRecoilState(disabledCheck);
  const setWorkRecordGenYears = useSetRecoilState(workRecordState);
  const setJobCate = useSetRecoilState(jobCateSelectState);
  const setIsSpecial = useSetRecoilState(isSpecialCheck);
  const setSumWorkDayState = useSetRecoilState(setSumWorkDay);
  const setDayAvgPayState = useSetRecoilState(setDayAvgPay);
  const setSumOneYearPayState = useSetRecoilState(setSumOneYearPay);
  const setEmployYearState = useSetRecoilState(setEmployYear);
  const setEmployMonthState = useSetRecoilState(setEmployMonth);
  const setTimeCountState = useSetRecoilState(setTimeCount);

  const existing_data = {
    ...handler._Data,
  };

  const ResetFunc = () => {
    setAgeState("");
    setDisbled("비장애인");
    handler._Data = existing_data;
    if (workCate === 0 || workCate === 1) {
      setEnterDayState("");
      setRetiredDayState("");
      setNormalSalary("");
      setDayWorkTimeSelect("");
      setWeekDay([false, false, false, false, false, false, false]);
      setTabSalaryState("all");
      SalaryTabInputState01("");
      SalaryTabInputState02("");
      SalaryTabInputState03("");
    }
    if (workCate === 2 || workCate === 3) {
      setEnterDayState("");
      setRetiredDayState("");
      setNormalSalary("");
      setLastWorkDayState("");
      setPlanToDoState("");
      tabStateInputArtState(false);
      tabStateIsShortsArtState(false);
      setWorkRecordGenYears([]);
      setTabStateIsShortArt("예술인");
      setTabStateIsShortSpecial("특고");
      setTabStateInput("개별 입력");
      setJobCate("");
      setSumOneYearPayState("");
      setHasWork("");
      setEmployYearState("");
      setEmployMonthState("");
      handler.SetPageVal("workRecord", []);
      handler.SetPageVal("is_short", "예술인");
      handler.SetPageVal("input", "개별 입력");
    }
    if (workCate === 4) {
      setEnterDayState("");
      setRetiredDayState("");
      setIsSpecial(false);
      setLastWorkDayState("");
      setWorkRecordGenYears([]);
      setPlanToDoState("");
      setHasWork("");
      setDayWorkTimeSelect("");
      setSumWorkDayState("");
      setDayAvgPayState("");
      setTabStateInput("개별 입력");
      handler.SetPageVal("input", "개별 입력");
      handler.SetPageVal("workRecord", []);
    }
    if (workCate === 5) {
      setEnterDayState("");
      setRetiredDayState("");
      setNormalSalary("");
      setWeekDay([false, false, false, false, false, false, false]);
      setTabSalaryState("all");
      SalaryTabInputState01("");
      SalaryTabInputState02("");
      SalaryTabInputState03("");
      setTimeCountState("");
    }
    if (workCate === 6) {
      setEnterDayState("");
      setRetiredDayState("");
      setTabSalaryState("all");
      for (let i = 0; i < handler?.setLevelYearArr?.length; i++) {
        handler?.setLevelYearArr[i]("");
      }
    }
  };

  useEffect(() => {
    if (handler.GetPageVal("cal_state") !== "multi") {
      setAgeState("");
      setDisbled("비장애인");
    }
    setLastWorkDayState("");
    setTabStateIsShortArt("예술인");
    setTabStateIsShortSpecial("특고");
    setTabStateInput("개별 입력");
    setEnterDayState("");
    setRetiredDayState("");
    setNormalSalary("");
    setDayWorkTimeSelect("");
    setWeekDay([false, false, false, false, false, false, false]);
    setTabSalaryState("all");
    SalaryTabInputState01("");
    SalaryTabInputState02("");
    SalaryTabInputState03("");
    setTimeCountState("");
    setWorkRecordGenYears([]);
    setEmployYearState("");
    setEmployMonthState("");
    setPlanToDoState("");
    tabStateInputArtState(false);
    tabStateIsShortsArtState(false);
    setJobCate("");
    setSumOneYearPayState("");
    setHasWork("");
    setDayAvgPayState("");
    setSumWorkDayState("");
  }, []);

  return (
    <button
      className="pd_810 help_link reset_button"
      onClick={() => {
        CreatePopup(
          "초기화",
          "입력 값들이 모두 초기화되고 처음 상태로 되돌아 갑니다.",
          "confirm",
          () => {
            ClosePopup();
            ResetFunc();
          }
        );
      }}
    >
      <img src={IMGResetIcon} alt="reset icon" />
      <span className="fs_12">초기화</span>
    </button>
  );
};

export default ResetButton;

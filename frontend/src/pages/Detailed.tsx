import { ReactElement, useEffect, useState } from "react";
import CalIsRetiree from "../components/calculator/IsRetiree";
import { DateInputNormal } from "../components/inputs/Date";
import Header from "../components/layout/Header";
import SelectInput from "../components/inputs/Select";
import TabInputs from "../components/inputs/TabInputs";
import DetailedHandler from "../object/detailed";
import WorkTypes from "../components/calculator/WorkTypes";
import { Year_Option_Generater } from "../utils/date";
import NumberInput from "../components/inputs/Pay";
import NumberUpDown from "../components/inputs/NumberUpDown";
import Button from "../components/inputs/Button";
import { ResultComp } from "../components/calculator/Result";
import CalContainer from "../components/calculator/CalContainer";
import Loading from "../components/common/Loading";
import CheckBoxInput from "../components/inputs/Check";
import { DetailConfirmPopup } from "../components/calculator/confirmPopup";
import WorkRecordGen from "../components/calculator/workRecordGen";
import "./../styles/detail.css";
import { jobCates } from "../assets/data/worktype_data";

const handler: any = new DetailedHandler({});

const _Belong_Form_Tab = ({
  label,
  options,
  form01,
  form02,
  callBack,
  params,
}: {
  label?: string | undefined | boolean;
  options?: string[] | undefined | boolean;
  form01: ReactElement;
  form02: ReactElement;
  callBack?: CallableFunction;
  params?: string;
}) => {
  const [state, setState] = useState(Array.isArray(options) && options[0]);
  return (
    <>
      <>
        <label className="fs_16 write_label">{label}</label>
        <div className="belong_form_tab">
          {Array.isArray(options) &&
            options?.map((el: string) => {
              return (
                <div
                  onClick={() => {
                    setState(el);
                    callBack && callBack(params, el);
                  }}
                  className={`fs_16 ${state === el ? "active" : ""}`}
                  key={String(Date.now()) + el}
                >
                  {el}
                </div>
              );
            })}
        </div>
      </>
      {Array.isArray(options) && state === options[0] ? (
        <>{form01}</>
      ) : (
        <>{form02}</>
      )}
    </>
  );
};

const _DetailCalStandad = ({ handler }: { handler: any }) => {
  return (
    <>
      <DateInputNormal
        params="enterDay"
        label="입사일"
        callBack={handler.SetPageVal}
      />
      {handler.GetPageVal("retired") && (
        <DateInputNormal
          params="retiredDay"
          label="퇴사일"
          callBack={handler.SetPageVal}
          description="insurance_end_day"
        />
      )}
      <CheckBoxInput
        type="box_type"
        options={["월", "화", "수", "목", "금", "토", "일"]}
        label="근무 요일"
        params="weekDay"
        callBack={handler.SetPageVal}
      />
      <SelectInput
        className="work_time"
        params="dayWorkTime"
        callBack={handler.SetPageVal}
        selected={"근무 시간을 선택해주세요."}
        type="normal"
        label="근무시간"
        value_type="string"
        options={[
          "근무 시간을 선택해주세요.",
          "3시간 미만",
          "4시간",
          "5시간",
          "6시간",
          "7시간",
          "8시간 이상",
        ]}
      />
      <TabInputs
        label="월 급여 (세전)"
        type="salary"
        params="salary"
        callBack={handler.SetPageVal}
        valueDay={handler.GetPageVal}
      />
    </>
  );
};

const _DetailCalDayJob = ({ handler }: { handler: any }) => {
  useEffect(() => {
    handler.SetPageVal("input", "개별 입력");
  }, []);
  return (
    <>
      <CheckBoxInput
        type="is_true_type"
        options={["건설일용직에 해당합니다."]}
        label="특수"
        params="isSpecial"
        callBack={handler.SetPageVal}
      />
      <_Belong_Form_Tab
        label="근로 정보"
        params="input"
        callBack={handler.SetPageVal}
        options={["개별 입력", "결과만 입력"]}
        form01={
          <>
            <DateInputNormal
              params="lastWorkDay"
              label="마지막 근무일"
              callBack={handler.SetPageVal}
            />
            <SelectInput
              selected={"시간을 선택해주세요."}
              type="normal"
              label="마지막 근무시간"
              value_type="string"
              className="work_time"
              options={[
                "시간을 선택해주세요.",
                "1시간",
                "2시간",
                "3시간",
                "4시간",
                "5시간",
                "6시간",
                "7시간",
                "8시간 이상",
              ]}
              params="dayWorkTime"
              callBack={handler.SetPageVal}
            />
            <DateInputNormal
              params="planToDo"
              label="신청 예정일"
              callBack={handler.SetPageVal}
            />
            <WorkRecordGen handler={handler} type="dayJob" />
            <DateInputNormal
              params="isOverTen"
              label="최근 근로일 정보"
              callBack={handler.SetPageVal}
              planToDo={handler.GetPageVal}
            />
          </>
        }
        form02={
          <>
            <DateInputNormal
              params="lastWorkDay"
              label="마지막 근무일"
              callBack={handler.SetPageVal}
            />
            <SelectInput
              selected={"시간을 선택해주세요."}
              type="normal"
              label="마지막 근무시간"
              value_type="string"
              className="work_time"
              options={[
                "시간을 선택해주세요.",
                "1시간",
                "2시간",
                "3시간",
                "4시간",
                "5시간",
                "6시간",
                "7시간",
                "8시간 이상",
              ]}
              params="dayWorkTime"
              callBack={handler.SetPageVal}
            />
            <NumberInput
              params="sumWorkDay"
              label="고용보험 총 기간"
              num_unit={["총", "일"]}
              callBack={handler.SetPageVal}
              k_parser={false}
            />
            <div className="fs_10 description">
              ※ 업무시작일이 아닌{" "}
              <span className="font_color_main fs_10">
                고용보험 전체 가입기간
              </span>
              을 기재해 주세요.
            </div>
            <NumberInput
              params="dayAvgPay"
              label="1일 평균임금"
              num_unit="원"
              callBack={handler.SetPageVal}
            />
            <div className="fs_14">※ 세전 금액으로 입력해 주세요.</div>
          </>
        }
      />
    </>
  );
};
const _DetailCalArt = ({ handler }: { handler: any }) => {
  useEffect(() => {
    handler.SetPageVal("input", "개별 입력");
    handler.SetPageVal(
      "is_short",
      handler.GetPageVal("workCate") === 2 ? "예술인" : "특고"
    );
  }, []);
  return (
    <_Belong_Form_Tab
      callBack={handler.SetPageVal}
      params="is_short"
      label={
        handler.GetPageVal("workCate") === 2
          ? "예술인 / 단기예술인"
          : handler.GetPageVal("workCate") === 3 && "특고 / 단기특고"
      }
      options={
        handler.GetPageVal("workCate") === 2
          ? ["예술인", "단기예술인"]
          : handler.GetPageVal("workCate") === 3 && ["특고", "단기특고"]
      }
      form01={
        <>
          {handler.GetPageVal("workCate") === 3 && (
            <SelectInput
              params="jobCate"
              callBack={handler.SetPageVal}
              selected={"직종을 선택해주세요."}
              type="normal"
              value_type="number"
              label="직종"
              options={jobCates}
            />
          )}
          <DateInputNormal
            params="enterDay"
            label="고용보험 가입일"
            callBack={handler.SetPageVal}
          />
          {handler.GetPageVal("retired") && (
            <DateInputNormal
              params="retiredDay"
              label="고용보험 종료일"
              callBack={handler.SetPageVal}
              description="insurance_end_day"
            />
          )}
          <NumberInput
            params="sumTwelveMonthSalary"
            placeholder="금액을 입력해주세요. (단위: 원) "
            label="퇴직 전 12개월 급여 총액 (세전)"
            num_unit="원"
            callBack={handler.SetPageVal}
          />
        </>
      }
      form02={
        <_Belong_Form_Tab
          label="근로 정보"
          callBack={handler.SetPageVal}
          params="input"
          options={["개별 입력", "결과만 입력"]}
          form01={
            <>
              <DateInputNormal
                params="lastWorkDay"
                label="마지막 근무일"
                callBack={handler.SetPageVal}
              />
              <WorkRecordGen handler={handler} type="shorts" />
              <DateInputNormal
                label="신청 예정일"
                params="planToDo"
                callBack={handler.SetPageVal}
              />
              <DateInputNormal
                planToDo={handler.GetPageVal}
                params="isOverTen"
                label="최근 근로일 정보"
                callBack={handler.SetPageVal}
              />
            </>
          }
          form02={
            <>
              <DateInputNormal
                params="lastWorkDay"
                label="마지막 근무일"
                callBack={handler.SetPageVal}
              />
              <NumberInput
                params={["employ_year", "employ_month"]}
                label="고용보험 총 기간"
                num_unit={["년", "개월"]}
                callBack={handler.SetPageVal}
                double={true}
                k_parser={false}
                className="border_b"
              />
              <NumberInput
                params="sumOneYearPay"
                label="퇴직 전 12개월 급여 총액 (세전)"
                placeholder="금액을 입력해주세요. (단위: 원) "
                num_unit="원"
                callBack={handler.SetPageVal}
              />
            </>
          }
        />
      }
    />
  );
};
const _DetailCalVeryShort = ({ handler }: { handler: any }) => {
  return (
    <>
      <DateInputNormal
        params="enterDay"
        label="입사일"
        callBack={handler.SetPageVal}
      />
      {handler.GetPageVal("retired") && (
        <DateInputNormal
          params="retiredDay"
          label="퇴사일"
          callBack={handler.SetPageVal}
          description="enter_day"
        />
      )}
      <CheckBoxInput
        type="box_type"
        options={["월", "화", "수", "목", "금", "토", "일"]}
        label="근무 요일"
        params="weekDay"
        callBack={handler.SetPageVal}
        maxLenth={2}
      />
      <NumberUpDown
        label="근무시간"
        label_unit="주"
        unit="시간"
        callBack={handler.SetPageVal}
        params="time"
        max_num={14}
      />
      <TabInputs
        label="월 급여 (세전)"
        type="salary"
        params="salary"
        callBack={handler.SetPageVal}
        valueDay={handler.GetPageVal}
      />
    </>
  );
};
const _DetailCalEmploy = ({ handler }: { handler: any }) => {
  return (
    <div id="detail_container_employ">
      <div className="public_side_padding">
        <DateInputNormal
          params="enterDay"
          label="고용보험 가입일"
          callBack={handler.SetPageVal}
        />
        <DateInputNormal
          params="retiredDay"
          label="고용보험 종료일"
          callBack={handler.SetPageVal}
          description="self-employment"
        />
        <TabInputs
          label="고용 보험 등급"
          type="select"
          callBack={handler.SetPageVal}
          valueDay={handler.GetPageVal}
        />
      </div>
    </div>
  );
};
export const DetailCalComp = ({
  workCate,
  handler,
  clickCallBack,
}: {
  workCate: number;
  handler: any;
  clickCallBack: CallableFunction;
}) => {
  return (
    <div id={`${workCate !== 6 ? "detail_comp_container" : ""}`}>
      <Header
        title="정보입력"
        leftLink="/main"
        leftType="BACK"
        leftFunc={() => {
          handler.setCompState(
            handler.GetPageVal("cal_state") === "multi" ? 1 : 2
          );
          handler.SetPageVal("workCate", undefined);
          handler.SetPageVal("retireReason", undefined);
        }}
      />
      <div className={`${workCate !== 6 ? "public_side_padding" : ""}`}>
        {workCate !== 6 && handler.GetPageVal("cal_state") !== "multi" && (
          <>
            <DateInputNormal
              params="age"
              label="생년월일"
              callBack={handler.SetPageVal}
              year={Year_Option_Generater(73)}
            />
            <CheckBoxInput
              type="circle_type"
              params="disabled"
              callBack={handler.SetPageVal}
              label="장애여부"
              options={["장애인", "비장애인"]}
            />
          </>
        )}
        {(workCate === 0 || workCate === 1) && (
          <_DetailCalStandad handler={handler} />
        )}
        {(workCate === 2 || workCate === 3) && (
          <_DetailCalArt handler={handler} />
        )}
        {workCate === 4 && <_DetailCalDayJob handler={handler} />}
        {workCate === 5 && <_DetailCalVeryShort handler={handler} />}
        {workCate === 6 && <_DetailCalEmploy handler={handler} />}
        <Button
          text="계산하기"
          type="bottom"
          click_func={() => clickCallBack()}
        />
      </div>
    </div>
  );
};

const DetailCalPage = () => {
  const [compState, setCompState] = useState(1);
  useEffect(() => {
    handler.setCompState = setCompState;
  }, []);
  return (
    <>
      {compState === 5 ? (
        <Loading />
      ) : (
        <CalContainer GetValue={handler.GetPageVal} type="상세형">
          <>
            {compState === 1 && <CalIsRetiree handler={handler} />}
            {compState === 2 && <WorkTypes handler={handler} />}
            {compState === 3 && (
              <DetailCalComp
                handler={handler}
                workCate={handler.GetPageVal("workCate")}
                clickCallBack={async () => {
                  await handler.Action_Cal_Result(
                    <DetailConfirmPopup
                      confirm_data={handler.GetPageVal("confirm_popup_result")}
                    />
                  );
                }}
              />
            )}
            {compState === 4 && (
              <ResultComp
                cal_type={handler.GetPageVal("workCate")}
                result_data={handler.GetPageVal("allresult")}
                back_func={() => handler.setCompState(3)}
              />
            )}
          </>
        </CalContainer>
      )}
    </>
  );
};

export default DetailCalPage;

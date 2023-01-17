import { ReactElement, useEffect, useState } from "react";
import CalIsRetiree from "../components/calculator/IsRetiree";
import {
  DateInputIndividual,
  DateInputNormal,
} from "../components/inputs/Date";
import Header from "../components/layout/Header";
import SelectInput from "../components/inputs/Select";
import TabInputs from "../components/inputs/TabInputs";
import DetailedHandler from "../object/detailed";
import WorkTypes from "../components/calculator/WorkTypes";
import { Year_Option_Generater } from "../utils/date";
import { ClosePopup, CreatePopup } from "../components/common/Popup";
import NumberInput from "../components/inputs/Pay";
import NumberUpDown from "../components/inputs/NumberUpDown";
import Button from "../components/inputs/Button";
import InputHandler from "../object/Inputs";
import { ResultComp } from "../components/calculator/Result";
import CalContainer from "../components/calculator/CalContainer";
import Loading from "../components/common/Loading";
import "./../styles/detail.css";
import { calRecording } from "../utils/calrecord";
import CheckBoxInput from "../components/inputs/Check";

class IndividualInputClass extends InputHandler {
  public _Data: any = {};
  public _Data_arr: any = [];
}

const handler2: any = new IndividualInputClass({});
const handler: any = new DetailedHandler({});

const IndividualInput = ({
  label = "개별 입력란",
  description,
}: {
  label?: string;
  description: string[];
}) => {
  useEffect(() => {
    handler2._Data_arr = [];
  }, []);

  const current_year_list = Year_Option_Generater(10);
  const [selectYears, setSelectYears] = useState<string[]>([]);
  const onClickPopUpDate = (year: string) => {
    if (!handler.GetPageVal("lastWorkDay")) {
      CreatePopup(undefined, "마지막 근무일을 선택해주세요", "only_check");
    } else {
      CreatePopup(
        `${String(year)}년`,
        <DateInputIndividual
          type={handler.GetPageVal("workCate")}
          handler={handler2}
          lastWorkDay={handler.GetPageVal("lastWorkDay")}
          year={year}
        />,
        "confirm",
        () => {
          const months = Object.keys(handler2._Data).map((el) => {
            return handler2._Data[el];
          });
          if (selectYears.includes(year)) {
            handler2._Data_arr = handler2._Data_arr.filter((el: any) => {
              return String(el.year) !== year;
            });
          }
          handler2._Data_arr.push({
            year: Number(year),
            months,
          });
          handler.SetPageVal("workRecord", handler2._Data_arr);
          setSelectYears(
            handler2._Data_arr.map((el: any) => {
              return String(el.year);
            })
          );
          ClosePopup();
        }
      );
    }
  };
  return (
    <>
      <label className="fs_16 write_label">{label}</label>
      <div className="lndividual_input_container flex_box">
        {current_year_list.map((el: string) => {
          return (
            <div
              onClick={() => onClickPopUpDate(el)}
              key={String(Date.now()) + el}
              className={`fs_16 pd_810 ${
                selectYears.includes(el) ? "select" : ""
              }`}
            >
              {el}
            </div>
          );
        })}
      </div>
      {description.map((el) => {
        return (
          <div key={String(Date.now()) + el} className="fs_10">{`* ${el}`}</div>
        );
      })}
    </>
  );
};

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

const _DetailCal01 = ({ handler }: { handler: any }) => {
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
        label="월 급여"
        type="salary"
        params="salary"
        callBack={handler.SetPageVal}
        valueDay={handler.GetPageVal}
      />
    </>
  );
};

const _DetailCal02 = ({ handler }: { handler: any }) => {
  useEffect(() => {
    handler.SetPageVal("input", "개별 입력");
  }, []);
  return (
    <>
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
            <IndividualInput
              description={["근무한 연월의 정보만 입력하시면 됩니다."]}
            />
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
const _DetailCal03 = ({ handler }: { handler: any }) => {
  useEffect(() => {
    handler.SetPageVal("input", "개별 입력");
    handler.SetPageVal(
      "is_short",
      handler.GetPageVal("workCate") === 3 ? "예술인" : "특고"
    );
  }, []);
  return (
    <_Belong_Form_Tab
      callBack={handler.SetPageVal}
      params="is_short"
      label={
        handler.GetPageVal("workCate") === 3
          ? "예술인 / 단기예술인"
          : handler.GetPageVal("workCate") === 4 && "특고 / 단기특고"
      }
      options={
        handler.GetPageVal("workCate") === 3
          ? ["예술인", "단기예술인"]
          : handler.GetPageVal("workCate") === 4 && ["특고", "단기특고"]
      }
      form01={
        <>
          {handler.GetPageVal("workCate") === 4 && (
            <SelectInput
              params="jobCate"
              callBack={handler.SetPageVal}
              selected={"직종을 선택해주세요."}
              type="normal"
              value_type="number"
              label="직종"
              options={[
                "직종을 선택해주세요.",
                "보험설계사",
                "신용카드 회원모집인",
                "대출모집인",
                "학습지 방문강사",
                "교육교구 방문강사",
                "택배 기사",
                "대여제품",
                "대여제품 방문점검원",
                "가전제품 배송 설치기사",
                "방문판매원",
                "건설기계조종사",
                "방과후학교 강사",
                "퀵서비스 기사",
                "대리운전 기사",
                "IT 소프트웨어 기술자",
                "어린이 통학버스 기사",
                "골프장 캐디",
                "관공통역 안내사",
                "화물차주 (유통배송기사, 택배 지간선기사, 특정품목운송차주)",
              ]}
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
            label="퇴직 전 12개월 급여 총액"
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
              <IndividualInput
                description={["근무한 연월의 정보만 입력하시면 됩니다."]}
              />
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
              />
              <NumberInput
                params="sumOneYearPay"
                label="퇴직 전 12개월 급여 총액"
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
const _DetailCal04 = ({ handler }: { handler: any }) => {
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
      />
      <NumberUpDown
        label="근무시간"
        label_unit="주"
        unit="시간"
        callBack={handler.SetPageVal}
        params="time"
      />
      <TabInputs
        label="월 급여"
        type="salary"
        params="salary"
        callBack={handler.SetPageVal}
        valueDay={handler.GetPageVal}
      />
    </>
  );
};
const _DetailCal05 = ({ handler }: { handler: any }) => {
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
        leftFunc={() =>
          handler.setCompState(
            handler.GetPageVal("cal_state") === "multi" ? 1 : 2
          )
        }
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
          <_DetailCal01 handler={handler} />
        )}
        {(workCate === 3 || workCate === 4) && (
          <_DetailCal03 handler={handler} />
        )}
        {workCate === 2 && <_DetailCal02 handler={handler} />}
        {workCate === 5 && <_DetailCal04 handler={handler} />}
        {workCate === 6 && <_DetailCal05 handler={handler} />}
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
    handler._Data = {};
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
                  const result_data = await handler.Action_Cal_Result();
                  console.log(handler.GetPageVal("workCate"));
                  calRecording(
                    result_data,
                    "상세형",
                    handler.GetPageVal("workCate") === 0
                      ? "정규직"
                      : handler.GetPageVal("workCate") === 1
                      ? "기간제"
                      : handler.GetPageVal("workCate") === 2
                      ? handler.GetPageVal("is_short")
                      : handler.GetPageVal("workCate") === 4
                      ? handler.GetPageVal("is_short")
                      : handler.GetPageVal("workCate") === 6
                      ? "일용직"
                      : handler.GetPageVal("workCate") === 7
                      ? "초단시간"
                      : handler.GetPageVal("workCate") === 8
                      ? "자영업"
                      : ""
                  );
                  handler.SetPageVal("result", result_data);
                }}
              />
            )}
            {compState === 4 && (
              <ResultComp
                cal_type={handler.GetPageVal("workCate")}
                result_data={handler.GetPageVal("result")}
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

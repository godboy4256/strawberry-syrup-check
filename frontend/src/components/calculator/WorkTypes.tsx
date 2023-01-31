import { MouseEventHandler, useEffect, useState } from "react";
import { ClosePopup, CreatePopup } from "../common/Popup";
import SelectInput from "../inputs/Select";
import Header from "../layout/Header";
import IMGWorkTypeSelect from "./../../assets/image/new/detail_info01_select.svg";
import IMGWorkTypeUnSelect from "./../../assets/image/new/detail_info01_unselect.svg";

export const work_cate = [
  "정규직",
  "기간제",
  "(단기) 예술인",
  "(단기) 특고·프리랜서",
  "일용직",
  "초단시간",
  "자영업",
];
export const jobCates = [
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
];

export const work_cate2 = [
  "정규직",
  "기간제",
  "예술인",
  "특고",
  "단기 예술인",
  "단기 특고",
  "일용직",
  "초단시간",
  "자영업",
];
export const retire_reason = [
  "권고사직",
  "계약만료",
  "질병",
  "임신/출산/육아",
  "회사 잘못",
  "원거리 통근",
  "정년퇴직",
  "기타 비자발적 사유",
];
export const retire_reason_popup = [
  `회사로부터 퇴사를 권유받아 자진퇴사 하셨나요?`,
  `계약기간의 만료로 회사를 계속 다닐 수 없게 되셨나요? 주의) 계약만료 후 회사의 재계약 제안을 근로자가 거부한 경우 수급자격이 인정되지 않습니다.`,
  `근로자 본인이 아프거나 가족의 질병으로 간호가 필요하신가요?`,
  `만 8세 이하 또는 초등학교 2학년 이하의 자녀의 육아를 위하여 퇴직하셨나요?`,
  `근로조건이 채용시 보다 낮아지셨나요? Ex) 임금체불, 최저임금 미달, 연장 근로위반, 평균임금 미만, 불합리한 차별대우, 성적 괴롭힘, 직장내 괴롭힘, 폐업, 고용조정 등`,
  `회사의 이전, 전근, 가족과 함께 하기 위해 또는 결혼으로 인한 이사 등의 사유로 출퇴근 3시간 이상이 소요되고 있나요?`,
  `만 60세 이상이고 자발적으로 퇴직하셨나요?`,
  `정해진 사유 외 기타 비자발적 사유는 고용노동센터에 반드시 문의하시기 바랍니다. 경우에 따라 실업급여를 수급하시지 못할 수도 있습니다.`,
];

const _CompSelectTemplete = ({
  level,
  name,
  selectState,
  callBack,
}: {
  level: number;
  name: string;
  selectState?: "select" | "next" | "none";
  callBack?: MouseEventHandler;
}) => {
  return (
    <>
      <div
        className={`comp_select_templete pd_810 ${
          selectState ? selectState : ""
        }`}
        onClick={callBack ? callBack : () => {}}
      >
        <div className="comp_select_templete_step fs_14">
          {level}단계 <span className="boundary"></span>
        </div>
        <div className="comp_select_templete_title fs_16">{name}</div>
        <div className="flex_left fs_14 un_value_font_color">{"입력 >"}</div>
      </div>
      {selectState === "select" ? (
        <img
          className="info01_icon"
          src={IMGWorkTypeSelect}
          alt="comp1 unselect icon "
        />
      ) : (
        <img
          className="info01_icon"
          src={IMGWorkTypeUnSelect}
          alt="comp select icon "
        />
      )}
    </>
  );
};

export const WorkCatePopup = ({
  handler,
  popUpCallBack,
  popup_focus_template,
}: any) => {
  return (
    <SelectInput
      label="근로형태 선택"
      popUpCallBack={popUpCallBack}
      callBack={handler.SetPageVal}
      popup_focus_template={popup_focus_template}
      popup_select={handler.GetPageVal}
      params="workCate"
      options={work_cate}
      type="popup"
    />
  );
};

const WorkTypes = ({ handler }: { handler: any }) => {
  useEffect(() => {
    handler._Data = {
      retired: handler._Data.retired,
    };
  }, []);
  const [workRypeInfo1, setState1] = useState<"select" | "next" | "none">(
    "next"
  );
  const [workRypeInfo2, setState2] = useState<"select" | "next" | "none">(
    "none"
  );
  const [workRypeInfo3, setState3] = useState<"select" | "next" | "none">(
    "none"
  );
  const popUpCallBack = (params: string, value: string) => {
    handler.SetPageVal(params, value);
    if (value === undefined) handler.SetPageVal(params, 0);
    setState1("select");
    if (!handler.GetPageVal("retireReason")) setState2("next");
    ClosePopup();
  };
  return (
    <>
      <Header
        title="정보입력"
        leftLink="/main"
        leftType="BACK"
        leftFunc={() => handler.setCompState(1)}
      />
      <div id="detail_container_comp1" className="full_height_layout_cal">
        <div className="public_side_padding">
          <WorkCatePopup
            handler={handler}
            popUpCallBack={popUpCallBack}
            popup_focus_template={
              <_CompSelectTemplete
                level={1}
                name="근로형태 선택"
                selectState={workRypeInfo1}
              />
            }
          />
          <SelectInput
            label="퇴직사유 선택"
            popUpCallBack={(params: string, value: string) => {
              handler.SetPageVal(params, value);
              setState2("select");
              setState3("next");
            }}
            callBack={handler.SetPageVal}
            popup_focus_template={
              <_CompSelectTemplete
                level={2}
                name="퇴직사유"
                selectState={workRypeInfo2}
              />
            }
            popup_select={handler.GetPageVal}
            params="retireReason"
            options={retire_reason}
            check_popup={retire_reason_popup}
            type="popup"
          />
          <_CompSelectTemplete
            level={3}
            name="개별 근로정보"
            selectState={workRypeInfo3}
            callBack={() => {
              if (
                handler.GetPageVal("workCate") !== undefined &&
                handler.GetPageVal("retireReason")
              ) {
                handler.setCompState(3);
              } else {
                CreatePopup(
                  undefined,
                  "근로형태와 퇴직사유를 모두 선택해주세요.",
                  "only_check"
                );
                return;
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default WorkTypes;

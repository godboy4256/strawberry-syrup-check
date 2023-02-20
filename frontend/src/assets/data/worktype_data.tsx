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
  "대여제품 방문점검원",
  "가전제품 배송 설치기사",
  "방문판매원",
  "건설기계조종사",
  "방과후학교 강사",
  "화물차주 (시멘트,철강,위험물질,수출업컨테이너)",
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

const RetireReasonPopup01 = () => {
  return (
    <div className="string_popup">
      회사로부터 퇴사를 권유받아 자진퇴사 하셨나요?
    </div>
  );
}; // 권고사직
const RetireReasonPopup02 = () => {
  return (
    <div className="string_popup">
      계약기간의 만료로 회사를 계속 다닐 수 없게 되셨나요?
      <br /> <br />
      <div className="fs_14">
        {"주의)"} 계약만료 후 회사의 재계약 제안을 근로자가 거부한 경우
        수급자격이 인정되지 않습니다.
      </div>
    </div>
  );
}; // 계약만료
const RetireReasonPopup03 = () => {
  return (
    <div className="string_popup txt_ct">
      근로자 본인이 아프거나 가족의 질병으로 간호가 필요하신가요?
    </div>
  );
}; // 질병
const RetireReasonPopup04 = () => {
  return (
    <div className="string_popup txt_ct">
      만 8세 이하 또는 초등학교 2학년 이하 자녀의 육아를 위하여 퇴직하셨나요?
    </div>
  );
}; // 임신/출산/육아
const RetireReasonPopup05 = () => {
  return (
    <div className="string_popup txt_ct">
      근로조건이 채용시 보다 낮아지셨나요?
      <br /> <br />
      <div className="fs_14">
        {"Ex)"} 임금체불, 최저임금 미달, 연장근로위반, 평균임금 미만, 불합리한
        차별대우, 성적 괴롭힘, 직장내 괴롭힘, 폐업, 고용조정 등
      </div>
    </div>
  );
}; // 회사 잘못

const RetireReasonPopup06 = () => {
  return (
    <div className="string_popup txt_ct">
      출퇴근 3시간 이상이 소요되고 있나요?
      <br /> <br />
      <div className="fs_14">
        {"Ex)"} 회사의 이전, 전근, 가족과 함께 하기 위해 또는 결혼으로 인한 이사
        등
      </div>
    </div>
  );
}; // 원거리 통근

const RetireReasonPopup07 = () => {
  return (
    <div className="string_popup txt_ct">
      만 60세 이상이고 자발적으로 퇴직하셨나요?
    </div>
  );
}; // 정년퇴직

const RetireReasonPopup08 = () => {
  return (
    <div className="string_popup txt_ct">
      정해진 사유 외 기타 비자발적 사유는 고용노동센터에 반드시 문의하시기
      바랍니다.
    </div>
  );
}; // 기타 비자발적 사유

// export const retire_reason_standard = [
//   { title: "권고사직", popup_content: <RetireReasonPopup01 /> },
//   { title: "질병", popup_content: <RetireReasonPopup04 /> },
//   { title: "임신/출산/육아", popup_content: <RetireReasonPopup05 /> },
//   { title: "회사 잘못", popup_content: <RetireReasonPopup05 /> },
//   { title: "원거리 통근", popup_content: <RetireReasonPopup06 /> },
//   { title: "정년퇴직", popup_content: <RetireReasonPopup07 /> },
//   { title: "기타 비자발적 사유", popup_content: <RetireReasonPopup08 /> },
// ];

// export const retire_reason_art = [
//   { title: "권고사직", popup_content: <RetireReasonPopup01 /> },
//   { title: "계약만료", popup_content: <RetireReasonPopup03 /> },
//   { title: "질병", popup_content: <RetireReasonPopup04 /> },
//   { title: "임신/출산/육아", popup_content: <RetireReasonPopup05 /> },
//   { title: "회사 잘못", popup_content: <RetireReasonPopup05 /> },
//   { title: "원거리 통근", popup_content: <RetireReasonPopup06 /> },
//   { title: "정년퇴직", popup_content: <RetireReasonPopup07 /> },
//   { title: "소득감소", popup_content: <RetireReasonPopup07 /> }, // 팝업 필요
//   { title: "기타 비자발적 사유", popup_content: <RetireReasonPopup08 /> },
// ];

// export const retire_reason_dayjob = [
//   { title: "권고사직", popup_content: <RetireReasonPopup01 /> },
//   { title: "계약만료", popup_content: <RetireReasonPopup03 /> },
//   { title: "질병", popup_content: <RetireReasonPopup04 /> },
//   { title: "임신/출산/육아", popup_content: <RetireReasonPopup05 /> },
//   { title: "회사 잘못", popup_content: <RetireReasonPopup05 /> },
//   { title: "원거리 통근", popup_content: <RetireReasonPopup06 /> },
//   { title: "정년퇴직", popup_content: <RetireReasonPopup07 /> },
//   { title: "기타 비자발적 사유", popup_content: <RetireReasonPopup08 /> },
// ];

// export const retire_reason_employ = [
//   { title: "매출액 감소", popup_content: <RetireReasonPopup01 /> },
//   { title: "적자 지속", popup_content: <RetireReasonPopup03 /> },
//   { title: "자연재해", popup_content: <RetireReasonPopup04 /> },
//   { title: "기타 불가피한 사유", popup_content: <RetireReasonPopup05 /> },
// ]; // 전체 팝업 디자인 필요

export const retire_reason_standard = [
  "권고사직",
  "질병",
  "임신/출산/육아",
  "회사 잘못",
  "원거리 통근",
  "정년퇴직",
  "기타 비자발적 사유",
];

export const retire_reason_art = [
  "권고사직",
  "계약만료",
  "질병",
  "임신/출산/육아",
  "회사 잘못",
  "원거리 통근",
  "정년퇴직",
  "소득감소",
  "기타 비자발적 사유",
];

export const retire_reason_dayjob = [
  "권고사직",
  "계약만료",
  "질병",
  "임신/출산/육아",
  "회사 잘못",
  "원거리 통근",
  "정년퇴직",
  "기타 비자발적 사유",
];

export const retire_reason_employ = [
  "매출액 감소",
  "적자 지속",
  "자연재해",
  "기타 불가피한 사유",
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

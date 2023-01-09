import { Link, Route, Routes } from "react-router-dom";
import Header from "../components/layout/Header";
import IMGBasicEmoticon from "../assets/image/new/basic.svg";
import "../styles/help.css";
import Button from "../components/inputs/Button";

const _Help1 = () => {
  return (
    <>
      <div id="strobarry_character">
        <img src={IMGBasicEmoticon} alt="Basic Strawberry Emoticon" />
      </div>
      <div className="help_box">
        <div className="help_title font_family_bold fs_18 lh_27">
          근무일수가 부족하다면?
        </div>
        <div className="fs_14">
          실업급여 요건인
          <span className="font_color_main fs_14">피보험단위기간 180일</span>은
          1개의 직장에서 구비해야 하는 것은 아닙니다.
          <br />
          <br />
          최종직장 이직일 기준 18개월 내 피보험단위기간을 합산하여 180일
          이상이면 됩니다.
        </div>
      </div>
      <div className="help_box">
        <div className="help_title font_family_bold fs_18 lh_27">
          어렵게 생각하지 마세요. <br />
          딸기시럽이
          <span className="font_color_point"> 알아서 </span>
          계산해드립니다.
        </div>
        <div className="fs_14 txt_ct">입사일, 퇴사일만 입력하면 OK</div>
      </div>
    </>
  );
};
const _Help2 = () => {
  return (
    <>
      <div className="help_box">
        <div className="help_title font_family_bold fs_18 lh_27">
          피보험단위기간이란?
        </div>
        <div className="fs_14 txt_ct">
          이직일 전 18개월간 보수지급의 기초가 된 날<br />
          (고용보험법 제41조) <br />
          <br />
          <span className="font_color_point fs_14">
            고용보험 홈페이지 - 이직확인서 처리여부 조회
          </span>
          <br />
          에서 피보험단위기간 확인 가능
          <br />
          <br /> 일용직의 경우,
          <span className="font_color_point fs_14">
            개인 - 증명원 신청/발급
          </span>
          에서 확인
        </div>
      </div>
      <div className="help_box">
        <div className="help_title font_family_bold fs_18 lh_27">
          피보험단위기간의 계산
        </div>
        <div className="fs_14 txt_ct">
          이직일 전 18개월 내 180일 근로한 날(주 5일)
          <br />
          + <br />
          유급휴가(주휴일, 근로자의날 등)
          <br />
          +<br />
          유급휴일(연차, 월차)
        </div>
      </div>
    </>
  );
};

const _Help3 = () => {
  return (
    <>
      <div className="help_box">
        <div className="help_title font_family_bold fs_18 lh_27">
          실업급여를 받을 수 <span className="font_color_point">있는 </span>
          퇴직사유
        </div>
        <ul className="help_guide_list">
          <li>
            <div className="fs_14">비자발적 퇴사</div>
            <div className="fs_14">
              예시{")"} 계약만료, 권고사직, 회사의 잘못, 질병, <br />
              임신/출산/육아, 통근곤란, 정년퇴직
              <br />
              예외{")"} 자발적 퇴사임에도 실업급여를 받을 수 있는 경우
            </div>
          </li>
          <li className="fs_14">임금체불</li>
          <li className="fs_14">통근이 3시간 이상</li>
          <li className="fs_14">직장 내 괴롭힘</li>
          <li className="fs_14">근로시간 52시간을 초과</li>
          <li className="fs_14">근로자 본인의 질병</li>
        </ul>
      </div>
      <div className="help_box">
        <div className="help_title font_family_bold fs_18 lh_27">
          실업급여를 받을 수 <span className="font_color_main">없는 </span>
          퇴직사유
        </div>
        <ul className="help_guide_list">
          <li className="fs_14">자발적 퇴사</li>
          <li className="fs_14">65세 이후 신규 고용된 경우</li>
          <li className="fs_14">
            사업 시작 시 3개월 미만 근무한 자, 공무원,
            <br />
            사립학교 연금법 혜택을 받는 근로자, <br />
            외국인 근로자, 별정우체국직원 등
          </li>
          <li className="fs_14">법률위반 등, 장기간 무단결근</li>
        </ul>
      </div>
    </>
  );
};

const _Help4 = () => {
  return (
    <>
      <div className="help_main_title font_family_bold">
        예술인의 피보험자격 이중취득
      </div>
      <div className="help_box">
        <div className="help_title font_family_bold fs_18 lh_27">
          동시에 여러 프로젝트 진행
        </div>
        <ul className="help_guide_list">
          <li>
            <div className="fs_14">
              프로젝트별로 고용보험을 각각 적용합니다.
            </div>
            <div className="fs_14">
              (기간이 겹치더라도 별도로 계산) 예시{")"} A프로젝트 : 1월 1일 ~
              15일 (15일) <br />
              B프로젝트 : 1월 10일 ~ 20일 (10일) <br />
              적용되는 피보험단위기간 : 25일
            </div>
          </li>
        </ul>
      </div>
      <div className="help_box">
        <div className="help_title font_family_bold fs_18 lh_27">
          고용보험 중복가입 가능여부
        </div>
        <div className="fs_14">
          (단기)예술인으로서 <br />
          2개 이상의 사업에서 동시에 ‘근로계약’과
          <br />
          ‘문화예술용역계약’을 체결한 경우 또는
          <br />
          ‘문화예술용역 계약’을 각각 체결한 경우
          <br />각 사업에서 모두 피보험자격을 취득합니다.
          <br />
          <br />
          ※ 근로자와 예술인 이중취득으로 실업급여를
          <br />
          받으려면 이직일 이전 24개월 중 3개월 이상
          <br />
          예술인으로 피보험자격을 유지해야 합니다.
        </div>
      </div>
      <div className="help_box">
        <div className="help_title font_family_bold fs_18 lh_27">
          자영업자인 경우
        </div>
        <div className="fs_14">
          예술인과는 중복가입이 불가능하고,
          <br />
          일용근로자 또는 단기예술인은
          <br />
          예술인과 자영업자 피보험자격 중 하나를
          <br />
          선택할 수 있습니다.
          <br />
          <br />
          예시{")"} 근로자 + 예술인 = 각각 취득
          <br /> 예술인 + 예술인 = 각각 취득
          <br /> 자영업자 + 예술인 = 예술인
          <br /> 자영업자 + 단기예술인(또는 일용근로자) = 택 1
        </div>
      </div>
      <div className="help_box">
        <div className="help_title font_family_bold fs_18 lh_27">
          어렵게 생각하지 마세요. <br />
          딸기시럽이
          <span className="font_color_point"> 알아서 </span>
          계산해드립니다.
        </div>
        <div className="fs_14 txt_ct">입사일, 퇴사일만 입력하면 OK</div>
      </div>
    </>
  );
};
const _Help5 = () => {
  return (
    <>
      <div className="help_main_title font_family_bold">단기예술인이란?</div>
      <div className="help_box fs_14">
        물화예술용역의 계약기간이 1개월 미만으로,
        <br />
        일 단위 또는 1개월 미만의 일시적인 노무를
        <br />
        제공하는 예술인
      </div>
    </>
  );
};

const _Help6 = () => {
  return (
    <>
      <div className="help_main_title font_family_bold">
        단기예술인 실업급여 계산방법
      </div>
      <div className="help_box fs_14">
        1. 이직일(퇴사일) 이전 24개월 동안 피보험단위기간이 합하여 9개월
        이상이며.
        <br />
        <br /> 2-1. 노무제공일이 11일 이상 = 1개월 <br />
        2-2. 노무제공일이 11일 미만 = 모두 합산÷22
        <br />
        <br />
        예시{")"}
        <div className="fs_14 info_table_help">
          <div className="flex_box info_tabel_head">
            <div className="table_bg_color1 info_table_list"></div>
            <div className="table_bg_color1 info_table_list flex_box flex_box_column_center flex_box_row_center font_family_bold fs_14">
              노무제공일수
            </div>
            <div className="table_bg_color1 info_table_list flex_box flex_box_column_center flex_box_row_center font_family_bold fs_14">
              피보험기간
            </div>
            <div className="table_bg_color1 info_table_list flex_box flex_box_column_center flex_box_row_center font_family_bold fs_14">
              적용식
            </div>
          </div>
          <div>
            <div className="flex_box">
              <div className="table_bg_color2 info_table_list flex_box flex_box_column_center flex_box_row_center font_family_bold">
                1월
              </div>
              <div className="table_bg_color4 info_table_list flex_box flex_box_column_center flex_box_row_center">
                11
              </div>
              <div className="table_bg_color4 info_table_list flex_box flex_box_column_center flex_box_row_center">
                1개월
              </div>
              <div className="table_bg_color4 info_table_list flex_box flex_box_column_center flex_box_row_center">
                11일 이상 = 1개월
              </div>
            </div>
            <div className="flex_box">
              <div className="table_bg_color2 info_table_list flex_box flex_box_column_center flex_box_row_center font_family_bold">
                2월
              </div>
              <div className="table_bg_color4 info_table_list flex_box flex_box_column_center flex_box_row_center">
                15
              </div>
              <div className="table_bg_color4 info_table_list flex_box flex_box_column_center flex_box_row_center">
                1개월
              </div>
              <div className="table_bg_color4 info_table_list flex_box flex_box_column_center flex_box_row_center">
                11일 이상 = 1개월
              </div>
            </div>
            <div className="flex_box">
              <div className="table_bg_color2 info_table_list flex_box flex_box_column_center flex_box_row_center font_family_bold">
                3월
              </div>
              <div className="table_bg_color3 info_table_list flex_box flex_box_column_center flex_box_row_center">
                8
              </div>
              <div className="table_bg_color3 info_table_list flex_box flex_box_column_center flex_box_row_center">
                8
              </div>
              <div className="table_bg_color3 info_table_list flex_box flex_box_column_center flex_box_row_center">
                11일 미만 = 합산 ÷ 22
              </div>
            </div>
            <div className="flex_box">
              <div className="table_bg_color2 info_table_list flex_box flex_box_column_center flex_box_row_center font_family_bold">
                4월
              </div>
              <div className="table_bg_color4 info_table_list flex_box flex_box_column_center flex_box_row_center">
                11
              </div>
              <div className="table_bg_color4 info_table_list flex_box flex_box_column_center flex_box_row_center">
                1개월
              </div>
              <div className="table_bg_color4 info_table_list flex_box flex_box_column_center flex_box_row_center">
                11일 이상 = 1개월
              </div>
            </div>
            <div className="flex_box">
              <div className="table_bg_color2 info_table_list flex_box flex_box_column_center flex_box_row_center font_family_bold">
                5월
              </div>
              <div className="table_bg_color3 info_table_list flex_box flex_box_column_center flex_box_row_center">
                9
              </div>
              <div className="table_bg_color3 info_table_list flex_box flex_box_column_center flex_box_row_center">
                9
              </div>
              <div className="table_bg_color3 info_table_list flex_box flex_box_column_center flex_box_row_center">
                11일 미만 = 합산 ÷ 22
              </div>
            </div>
            <div className="flex_box">
              <div className="table_bg_color2 info_table_list flex_box flex_box_column_center flex_box_row_center font_family_bold">
                6월
              </div>
              <div className="table_bg_color3 info_table_list flex_box flex_box_column_center flex_box_row_center">
                10
              </div>
              <div className="table_bg_color3 info_table_list flex_box flex_box_column_center flex_box_row_center">
                10
              </div>
              <div className="table_bg_color3 info_table_list flex_box flex_box_column_center flex_box_row_center">
                11일 미만 = 합산 ÷ 22
              </div>
            </div>
            <div className="flex_box">
              <div className="table_bg_color2 info_table_list font_family_bold">
                계산 결과
              </div>
              <div className="info_table_list last_childe_w">
                1, 2, 4월은 (1+1+1) = 3개월
                <br />
                3, 5, 9월은 (8+9+10) ÷ 22 = 1.3개월
                <br />
                따라서, 이 경우 피보험기간은
                <span className="font_color_main"> 4.3개월</span>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const _Help7 = () => {
  return (
    <>
      <div className="help_main_title font_family_bold">
        일용직의 퇴직금 지급 기준
      </div>
      <div className="help_box fs_14">
        1. 하루 단위의 계약이 1년 이상 계속 된다면,
        <br /> 퇴직금을 받으실 수 있습니다. <br />
        <br />
        2. 같은 고용주와 고용관계가 1년 이상 지속되는
        <br /> 등 사용종속 관계가 유지되는지 판단함
      </div>
    </>
  );
};
const _Help8 = () => {
  return (
    <>
      <div className="help_main_title font_family_bold">예술인의 소득합산</div>
      <div className="help_box fs_14">
        계약이 2개 이상일 경우, 다른 계약 건과
        <br />
        ‘합산’하여 월 소득 50만원이 된다면 고용보험에 가입이 가능합니다.
        <br /> <br /> 이 경우, 예술인 본인이 직접 근로복지공단에 피보험자격을
        신고하셔야 합니다. <br /> <br />
        신고 기한은 합산하여 적용기준 소득 이상이 되는 날의 다음 달 15일까지
        신고하셔야 하며, 신고기간 이후 또는 계약기간이 종료된 이후에는
        취득신청이 불가합니다.
        <br />
        <br />
        <div className="fs_10">
          소득합산신청 = 복수사업장 피보험자격 소득합산신청서 + 계약서
        </div>
      </div>
      <button className="font_color_main help_appli">신청 바로가기</button>
    </>
  );
};
const _Help9 = () => {
  return (
    <>
      <div className="help_main_title font_family_bold">
        특고·프리랜서 소득합산
      </div>
      <div className="help_box fs_14">
        계약이 2개 이상일 경우, 다른 계약 건과
        <br />
        ‘합산’하여 월 소득 50만원이 된다면 고용보험에 가입이 가능합니다.
        <br /> <br /> 이 경우, 노무제공자 본인이 직접 근로복지공단에
        피보험자격을 신고하셔야 합니다. <br /> <br />
        신고 기한은 합산하여 적용기준 소득 이상이 되는 날의 다음 달 15일까지
        신고하셔야 하며, 신고기간 이후 또는 계약기간이 종료된 이후에는
        취득신청이 불가합니다.
        <br />
        <br />
        <div className="fs_10">
          소득합산신청 = 복수사업장 피보험자격 소득합산신청서 + 계약서
        </div>
      </div>
      <button className="font_color_main help_appli">신청 바로가기</button>
    </>
  );
};

const HelpPage = () => {
  return (
    <>
      <Header title="도움말" leftType="BACK" leftLink="/main" />
      <div id="helppage_container" className="public_side_padding">
        <Routes>
          <Route path="1" element={<_Help1 />} />
          <Route path="2" element={<_Help2 />} />
          <Route path="3" element={<_Help3 />} />
          <Route path="4" element={<_Help4 />} />
          <Route path="5" element={<_Help5 />} />
          <Route path="6" element={<_Help6 />} />
          <Route path="7" element={<_Help7 />} />
          <Route path="8" element={<_Help8 />} />
          <Route path="9" element={<_Help9 />} />
        </Routes>
        <Link to="/main">
          <Button text="홈으로" type="bottom" click_func={() => {}} />
        </Link>
      </div>
    </>
  );
};

export default HelpPage;

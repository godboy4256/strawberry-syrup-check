import EMTDetailArtsSupply from "../../assets/image/emoticon/detail_arts_supply.svg";
import EMTDetailSpecialsSupply from "../../assets/image/emoticon/detail_specials_supply.svg";
import EMTDetailDayJobSupply from "../../assets/image/emoticon/detail_dayjob_supply.svg";
import EMTDetailEmploySupply from "../../assets/image/emoticon/detail_employ_supply.svg";
import EMTDetailFullTimeSupply from "../../assets/image/emoticon/detail_fulltime_supply.svg";
import EMTDetailContractSupply from "../../assets/image/emoticon/detail_contract_supply.svg";
import EMTDetailVeryShortsSupply from "../../assets/image/emoticon/detail_veryshort_supply.svg";
import EMTBasicSupplyRetiree from "../../assets/image/emoticon/standad_retiree_supply.svg";

import EMTDetailArtsUnSupply from "../../assets/image/emoticon/detail_arts_unsupply.svg";
import EMTDetailSpecialsUnSupply from "../../assets/image/emoticon/detail_specials_unsupply.svg";
import EMTDetailDayJobUnSupply from "../../assets/image/emoticon/detail_dayjob_unsupply.svg";
import EMTDetailEmployUnSupply from "../../assets/image/emoticon/detail_employ_unsupply.svg";
import EMTDetailFullTimeUnSupply from "../../assets/image/emoticon/detail_fulltime_unsupply.svg";
import EMTDetailContractUnSupply from "../../assets/image/emoticon/detail_contract_unsupply.svg";
import EMTDetailVeryShortsUnSupply from "../../assets/image/emoticon/detail_veryshort_unsupply.svg";

import EMTBasicUnSupplyUnRetiree from "../../assets/image/emoticon/standad_unretiree_unsupply.svg";
import EMTBasicUnSupplyRetiree from "../../assets/image/emoticon/standad_retiree_unsupply.svg";
import Header from "../layout/Header";
import "../../styles/result.css";
import HelpLink from "../common/HelpLink";
import Button from "../inputs/Button";
import Loading from "../common/Loading";

const _SupplyResult = ({
  total,
  day_pay,
  month_pay,
  severance_pay,
  day_num,
  emoticon,
  help,
  guide_card = false,
}: {
  total: number;
  day_pay: number;
  day_num: number;
  month_pay: number;
  severance_pay: number;
  emoticon: string;
  help?: [string, string];
  guide_card?: boolean;
}) => {
  return (
    <div id="result_container">
      <img id="result_emoticon" src={emoticon} alt="Result Emoticon" />
      <h3 id="result_comment" className="lh_27 fs_18 font_family_bold">
        당신은 실업 급여 수급대상자 입니다.
      </h3>
      <div id="result_top">
        <div id="result_top_header" className="bg_color_main font_color_white">
          총 수령액 :
          <span className="fs_25 font_color_white font_family_bold">
            {total?.toLocaleString()}
          </span>
          원
        </div>
        <div id="result_top_content">
          <div className="lh_18 fs_12">
            하루
            <span className="font_color_main fs_12">{` ${day_pay?.toLocaleString()} `}</span>{" "}
            원을
            <span className="font_color_main fs_12">{` ${day_num?.toLocaleString()} `}</span>
            일 동안,
          </div>
          <div className="lh_27">
            월
            <span className="font_color_main">
              {month_pay?.toLocaleString()}
            </span>
            원 받아요!
          </div>
        </div>
      </div>
      {severance_pay ? (
        <div id="severance_pay_container">
          <div
            id="severance_pay_comment"
            className="fs_18 lh_27 font_family_bold"
          >
            고생 많으셨습니다!
          </div>
          <div
            id="severance_pay_box"
            className="bg_color_main font_color_white"
          >
            예상 퇴직금 :
            <span className="fs_25  font_color_white">
              {severance_pay?.toLocaleString()}
            </span>
            원
          </div>
        </div>
      ) : null}
      {guide_card && (
        <div className="guide_card fs_14">
          근로자가
          <span className="font_color_main fs_14"> 상시 50인 이상</span> 이거나,
          <br />
          고용보험료를 일정 횟수
          <span className="font_color_main fs_14"> 체납 </span>한 경우
          <br />
          실업급여를 받지 못합니다.
        </div>
        // 지금은 자영업자에 밖에 사용되지 않기 때문에 고정되어 있지만
        // 추 후에 가이드 카드가 필요한 곳이 더 생길 경우 따로 객체를 만들어 가이드 컴포넌트를 관리
      )}
      <div id="result_guide_comment01" className="fs_14">
        계산 결과는 자동으로 저장되며, <br />
        <span className="font_color_main fs_14">이전 계산 내역</span>
        에서 확인하실 수 있습니다.
      </div>
      {help && (
        <HelpLink
          text="일용직도 퇴직금을 받을 수 있다?"
          link="/"
          direction="r"
        />
      )}
      <div id="result_guide_comment02">
        <div className="fs_10">
          계약 내용 등 구체적인 사정에 따라 결과가 달라질 수 있습니다.
        </div>
        <div className="fs_10">
          정확한 결과를 확인하시기 위해서는 관할 고용센터로 문의하시기 바랍니다.
        </div>
      </div>
    </div>
  );
};

const _UnSupplyResult = ({
  emoticon,
  unit,
  workingDateNum,
  requireDateNum,
  guide_card = false,
  helps,
}: {
  emoticon: string;
  unit: "day" | "month";
  workingDateNum: number;
  requireDateNum: number;
  guide_card?: boolean;
  helps?: string | string[];
}) => {
  return (
    <div id="result_container">
      <img id="result_emoticon" src={emoticon} alt="Result Emoticon" />
      <h3 id="result_comment" className="lh_27 fs_18 font_family_bold">
        실업급여를 받으실 수 없습니다.
      </h3>
      <div id="result_unsupply_container" className="bg_color_main">
        <div className="font_color_white flex_box fs_14">
          현재 근무{unit === "day" ? "일" : "월"}수 :
          <span className="unsupply_result_value font_color_white">
            {workingDateNum}
          </span>
          {unit === "day" ? "일" : "달"}
        </div>
        <div className="font_color_white flex_box fs_14">
          부족한 근무{unit === "day" ? "일" : "월"}수 :{" "}
          <span className="unsupply_result_value font_color_white">
            {requireDateNum}
          </span>
          {unit === "day" ? "일" : "달"}
        </div>
      </div>
      <HelpLink text="피보험단위기간이란 무엇인가요?" link="/" direction="l" />
      <HelpLink text="근무일수가 부족하다면?" link="/" direction="l" />
      <div id="result_guide_comment03" className="fs_12 flex_right">
        이전에 다녔던 직장이 있다면 <br />
        <span className="font_color_main fs_12">복수형 계산기</span>로
        추가계산을 해보세요!
      </div>
    </div>
  );
};

export const ResultComp = ({
  cal_type,
  result_data,
}: {
  cal_type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "basic";
  result_data: any;
}) => {
  return (
    <>
      <Header title="계산 결과" leftLink="/" leftType="BACK" />
      {cal_type === 0 &&
        // 정규직
        (result_data.succ ? (
          <_SupplyResult
            total={result_data?.availableAmountCost}
            day_pay={result_data?.realDayPay}
            month_pay={result_data?.realMonthPay}
            severance_pay={result_data?.severancePay}
            day_num={result_data?.receiveDay}
            emoticon={EMTDetailFullTimeSupply}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailFullTimeUnSupply}
            unit="day"
            workingDateNum={result_data.workingDays}
            requireDateNum={result_data.requireDays}
          />
        ))}
      {cal_type === 1 &&
        // 기간제
        (result_data.succ ? (
          <_SupplyResult
            total={result_data?.availableAmountCost}
            day_pay={result_data?.realDayPay}
            month_pay={result_data?.realMonthPay}
            severance_pay={result_data?.severancePay}
            day_num={result_data?.receiveDay}
            emoticon={EMTDetailContractSupply}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailContractUnSupply}
            unit="day"
            workingDateNum={result_data.workingDays}
            requireDateNum={result_data.requireDays}
          />
        ))}
      {cal_type === "basic" &&
        // 기본형
        (result_data.succ ? (
          <_SupplyResult
            total={result_data?.availableAmountCost}
            day_pay={result_data?.realDayPay}
            month_pay={result_data?.realMonthPay}
            severance_pay={result_data?.severancePay}
            day_num={result_data?.receiveDay}
            emoticon={EMTBasicSupplyRetiree}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTBasicUnSupplyUnRetiree}
            unit="day"
            workingDateNum={result_data.workingDays}
            requireDateNum={result_data.requireDays}
          />
        ))}
      {cal_type === 2 &&
        // 일용직
        (result_data.succ ? (
          <_SupplyResult
            total={result_data?.amountCost}
            day_pay={result_data?.realDayPay}
            month_pay={result_data?.realMonthPay}
            severance_pay={result_data?.severancePay}
            day_num={result_data?.receiveDay}
            emoticon={EMTDetailDayJobSupply}
            help={["", "일용직도 퇴직금을 받을 수 있다?"]}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailDayJobUnSupply}
            unit="day"
            workingDateNum={result_data.workingDays}
            requireDateNum={result_data.requireWorkingDay}
          />
        ))}
      {cal_type === 3 &&
        // 예술인 ,단기 예술인
        (result_data.succ ? (
          <_SupplyResult
            total={result_data?.availableAmountCost}
            day_pay={result_data?.artRealDayPay}
            month_pay={result_data?.artRealMonthPay}
            severance_pay={result_data?.severancePay}
            day_num={result_data?.receiveDay}
            emoticon={EMTDetailArtsSupply}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailArtsUnSupply}
            unit="day"
            workingDateNum={result_data.workingMonths}
            requireDateNum={result_data.requireMonths}
          />
        ))}
      {cal_type === 4 &&
        // 특고 ,단기 특고
        (result_data.succ ? (
          <_SupplyResult
            total={result_data?.availableAmountCost}
            day_pay={result_data?.artRealDayPay}
            month_pay={result_data?.artRealMonthPay}
            severance_pay={result_data?.severancePay}
            day_num={result_data?.receiveDay}
            emoticon={EMTDetailSpecialsSupply}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailSpecialsUnSupply}
            unit="day"
            workingDateNum={result_data.workingMonths}
            requireDateNum={result_data.requireMonths}
          />
        ))}
      {cal_type === 5 &&
        // 초단 시간
        (result_data.succ ? (
          <_SupplyResult
            total={result_data?.amountCost}
            day_pay={result_data?.realDayPay}
            month_pay={result_data?.realMonthPay}
            severance_pay={result_data?.severancePay}
            day_num={result_data?.receiveDay}
            emoticon={EMTDetailVeryShortsSupply}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailVeryShortsUnSupply}
            unit="day"
            workingDateNum={result_data.workingDays}
            requireDateNum={result_data.requireDays}
          />
        ))}
      {cal_type === 6 &&
        // 자영업
        (result_data.succ ? (
          <_SupplyResult
            total={result_data?.amountCost}
            day_pay={result_data?.realDayPay}
            month_pay={result_data?.realMonthPay}
            severance_pay={result_data?.severancePay}
            day_num={result_data?.receiveDay}
            emoticon={EMTDetailEmploySupply}
            guide_card={true}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailEmployUnSupply}
            unit="day"
            workingDateNum={result_data.workingDays}
            requireDateNum={result_data.requireDays}
          />
        ))}
      <div id="result_button_container">
        <Button
          text={result_data.succ ? "N달 더 일하면?" : "복수형 계산기로"}
          type="popup_cancel"
          click_func={() => {}}
        />
        <Button text="홈으로" type="popup_ok" click_func={() => {}} />
      </div>
    </>
  );
};

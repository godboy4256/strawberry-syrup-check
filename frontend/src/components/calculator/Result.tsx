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
import EMTBasicUnSupplyRetiree from "../../assets/image/emoticon/standad_retiree_unsupply.svg";
import HelpLink from "../common/HelpLink";
import Button from "../inputs/Button";
import Header from "../layout/Header";
import "../../styles/result.css";
import { Link } from "react-router-dom";

const _SupplyResult = ({
  emoticon,
  help,
  result_data,
  guide_card = false,
}: {
  emoticon: string;
  result_data: any;
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
            {result_data?.amountCost?.toLocaleString()}
          </span>
          원
        </div>
        <div id="result_top_content">
          <div className="lh_18 fs_12">
            하루
            <span className="font_color_main fs_12">{` ${result_data?.realDayPay?.toLocaleString()} `}</span>{" "}
            원을
            <span className="font_color_main fs_12">{` ${result_data?.receiveDay?.toLocaleString()} `}</span>
            일 동안,
          </div>
          <div className="lh_27">
            월
            <span className="font_color_main">
              {result_data?.realMonthPay?.toLocaleString()}
            </span>
            원 받아요!
          </div>
        </div>
      </div>
      {result_data?.severancePay ? (
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
              {result_data?.severancePay?.toLocaleString()}
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
  result_data,
  average_guide,
  helps = ["피보험단위기간이란 무엇인가요?", "근무일수가 부족하다면?"],
  helps_to = ["/", "/"],
  twoweek_guide = false,
}: {
  emoticon: string;
  unit: "day" | "month";
  result_data: any;
  average_guide?: string;
  helps?: string[];
  helps_to?: string[];
  twoweek_guide?: boolean;
}) => {
  console.log("결과", result_data);
  return (
    <div id="result_container">
      <img id="result_emoticon" src={emoticon} alt="Result Emoticon" />
      <h3 id="result_comment" className="lh_27 fs_18 font_family_bold">
        실업급여를 받으실 수 없습니다.
      </h3>
      {twoweek_guide ? (
        <div id="twoweek_guide_container lh_27">
          <div className="fs_14">
            신청일 이전 14일 간 근로내역이
            <br />
            없어야 합니다.
          </div>
          <div className="font_color_main lh_27">
            N년 N월 N일 이후 신청하시면
            <br /> 실업급여를 받으실 수 있습니다.
          </div>
        </div>
      ) : (
        <div id="result_unsupply_container" className="bg_color_main">
          <div className="font_color_white flex_box fs_14">
            현재 근무{unit === "day" ? "일" : "월"}수 :
            <span className="unsupply_result_value font_color_white">
              {result_data?.workingDays
                ? result_data?.workingDays
                : result_data?.workingMonths}
            </span>
            {unit === "day" ? "일" : "달"}
          </div>
          <div className="font_color_white flex_box fs_14">
            부족한 근무{unit === "day" ? "일" : "월"}수 :{" "}
            <span className="unsupply_result_value font_color_white">
              {result_data?.requireDays
                ? result_data?.requireDays
                : result_data?.requireMonths}
            </span>
            {unit === "day" ? "일" : "달"}
          </div>
        </div>
      )}
      {average_guide &&
        (typeof average_guide === "number" ? (
          <div id="average_guide_container" className="font_color_main lh_27">
            월 평균소득 {average_guide} 이상으로
            <br /> {result_data?.requireWorkingDay}일 더 일하셔야 합니다.
          </div>
        ) : (
          <div id="average_guide_container" className="guide_normal fs_14">
            {average_guide}
          </div>
        ))}
      {helps?.map((el: string, idx: number) => {
        return (
          <HelpLink
            className={`result_help_link${idx + 1}`}
            key={Date.now() + idx}
            text={el}
            link={helps_to ? helps_to[idx] : "/"}
            direction="l"
          />
        );
      })}

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
  back_func,
}: {
  cal_type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "basic" | "multi";
  result_data: any;
  back_func: () => void;
}) => {
  return (
    <>
      <Header
        title="계산 결과"
        leftLink="/main"
        leftType="BACK"
        leftFunc={back_func}
      />
      {cal_type === "multi" &&
        // 복수형
        (result_data.succ ? (
          <_SupplyResult
            result_data={result_data}
            emoticon={EMTDetailFullTimeSupply}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailFullTimeUnSupply}
            unit="day"
            result_data={result_data}
          />
        ))}
      {cal_type === 0 &&
        // 정규직
        (result_data.succ ? (
          <_SupplyResult
            result_data={result_data}
            emoticon={EMTDetailFullTimeSupply}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailFullTimeUnSupply}
            unit="day"
            result_data={result_data}
          />
        ))}
      {cal_type === 1 &&
        // 기간제
        (result_data.succ ? (
          <_SupplyResult
            result_data={result_data}
            emoticon={EMTDetailContractSupply}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailContractUnSupply}
            unit="day"
            result_data={result_data}
          />
        ))}
      {cal_type === "basic" &&
        // 기본형
        (result_data.succ ? (
          <_SupplyResult
            result_data={result_data}
            emoticon={EMTBasicSupplyRetiree}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTBasicUnSupplyRetiree}
            unit="day"
            result_data={result_data}
          />
        ))}
      {cal_type === 2 &&
        // 일용직
        (result_data.succ ? (
          <_SupplyResult
            result_data={result_data}
            emoticon={EMTDetailDayJobSupply}
            help={["", "일용직도 퇴직금을 받을 수 있다?"]}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailDayJobUnSupply}
            unit="day"
            result_data={result_data}
            average_guide="신청일 이전 1달 간 근로일수가 10일 미만이어야 합니다."
          />
        ))}
      {cal_type === 3 &&
        // 예술인 ,단기 예술인
        (result_data.succ ? (
          <_SupplyResult
            result_data={result_data}
            emoticon={EMTDetailArtsSupply}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailArtsUnSupply}
            unit="month"
            result_data={result_data}
            helps={
              result_data.is_short === "단기 예술인"
                ? ["단기예술인 실업급여의 계산방법이 궁금하신가요?"]
                : ["저는 여러 건을 합치면 월 평균 기준이 되는데요?"]
            }
            helps_to={result_data.is_short === "단기 예술인" ? ["/"] : ["/"]}
            average_guide={
              result_data.is_short !== "단기 예술인" ? "50만원" : ""
            }
          />
        ))}
      {cal_type === 4 &&
        // 특고 ,단기 특고
        (result_data.succ ? (
          <_SupplyResult
            result_data={result_data}
            emoticon={EMTDetailSpecialsSupply}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailSpecialsUnSupply}
            unit="month"
            result_data={result_data}
          />
        ))}
      {cal_type === 5 &&
        // 초단 시간
        (result_data.succ ? (
          <_SupplyResult
            result_data={result_data}
            emoticon={EMTDetailVeryShortsSupply}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailVeryShortsUnSupply}
            unit="day"
            result_data={result_data}
          />
        ))}
      {cal_type === 6 &&
        // 자영업
        (result_data.succ ? (
          <_SupplyResult
            result_data={result_data}
            emoticon={EMTDetailEmploySupply}
            guide_card={true}
          />
        ) : (
          <_UnSupplyResult
            emoticon={EMTDetailEmployUnSupply}
            unit="day"
            result_data={result_data}
          />
        ))}
      <div id="result_button_container">
        {cal_type !== "basic" && (
          <Link to="/multi">
            <Button
              text={result_data.succ ? "N달 더 일하면?" : "복수형 계산기로"}
              type="popup_cancel"
              click_func={() => {}}
            />
          </Link>
        )}
        <Link to="/main">
          <Button text="홈으로" type="popup_ok" click_func={() => {}} />
        </Link>
      </div>
    </>
  );
};

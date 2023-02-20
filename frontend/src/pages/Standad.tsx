import { useState, Dispatch, SetStateAction, useEffect } from "react";
import IsRetiree from "../components/calculator/IsRetiree";
import Button from "../components/inputs/Button";
import { DateInputNormal } from "../components/inputs/Date";
import NumberInput from "../components/inputs/Pay";
import InputHandler from "../object/Inputs";
import { sendToServer } from "../utils/sendToserver";
import { GetDateArr } from "../utils/date";
import Header from "../components/layout/Header";
import IMGBasicCuriousEmoticon from "../assets/image/emoticon/basic_curious.svg";
import IMGBasicEngryEmoticon from "../assets/image/emoticon/basic_angry.svg";
import { ResultComp } from "../components/calculator/Result";
import CalContainer from "../components/calculator/CalContainer";
import Loading from "../components/common/Loading";
import { CheckValiDation } from "../utils/validate";
import { calRecording } from "../utils/calrecord";
import "./../styles/basic.css";

class BasicCalHandler extends InputHandler {
  public result: {} = {};
  public setCompState: Dispatch<SetStateAction<number>> | undefined = undefined;
  public Action_Cal_Result = async () => {
    const to_server = {
      ...this._Data,
      retired: this._Data.retired,
      retiredDay: this._Data.retired
        ? this._Data.retiredDay
        : `${GetDateArr(null)[0]}-${GetDateArr(null)[1]}-${
            GetDateArr(null)[2]
          }`,
    };
    if (!CheckValiDation("standad", to_server)) return;
    this.setCompState && this.setCompState(4);
    this.result = await sendToServer("/standard", to_server);
    calRecording(this.result, "기본형");
    setTimeout(() => {
      this.setCompState && this.setCompState(3);
    }, 1000);
  };
}
const handler = new BasicCalHandler({});

const _BasicCalComp = () => {
  return (
    <div className="full_height_layout_cal pb_50">
      <Header
        title={handler.GetPageVal("retired") ? "퇴직자" : "퇴직예정자"}
        leftLink="/main"
        leftType="BACK"
        leftFunc={() => {
          handler.setCompState && handler.setCompState(1);
          handler.SetPageVal("retired", undefined);
        }}
      />
      <div className="public_side_padding">
        <div id="strobarry_character">
          <img
            src={
              handler.GetPageVal("retired")
                ? IMGBasicCuriousEmoticon
                : IMGBasicEngryEmoticon
            }
            alt="Basic Strawberry Emoticon"
          />
        </div>
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
          />
        )}
        <NumberInput
          params="salary"
          label="월 급여(세전)"
          num_unit="원"
          className="border_b"
          guide={true}
          callBack={handler.SetPageVal}
        />
        <Button
          text="계산하기"
          type="bottom"
          click_func={handler.Action_Cal_Result}
        />
      </div>
    </div>
  );
};

const BasicCalPage = () => {
  const [compState, setCompState] = useState(1);
  useEffect(() => {
    handler.setCompState = setCompState;
  }, []);
  return (
    <>
      {compState === 4 ? (
        <Loading />
      ) : (
        <CalContainer type="기본형" GetValue={handler.GetPageVal}>
          <>
            {compState === 1 && <IsRetiree handler={handler} />}
            {compState === 2 && <_BasicCalComp />}
            {compState === 3 && (
              <ResultComp
                cal_type="basic"
                result_data={handler.result}
                back_func={() => {
                  handler.setCompState && handler.setCompState(2);
                }}
              />
            )}
          </>
        </CalContainer>
      )}
    </>
  );
};

export default BasicCalPage;

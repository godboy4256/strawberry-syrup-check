import Button from "../components/inputs/Button";
import NumberUpDown from "../components/inputs/NumberUpDown";
import Header from "../components/layout/Header";
import InputHandler from "../object/Inputs";
import { sendToServer } from "../utils/sendToserver";
import "../styles/minumum_saraly.css";
import { ResultComp } from "../components/calculator/Result";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Loading from "../components/common/Loading";
import { CreatePopup } from "../components/common/popup";

class MinimumSalaryHandler extends InputHandler {
  public setCompState: Dispatch<SetStateAction<number>> | undefined = undefined;
  public Action_MinimumSalary_Cal = async () => {
    const to_server = {
      workHour: this._Data.workHour,
      workMin: this._Data.workMin,
      workDay: this._Data.workDay,
      pay: 9620,
    };
    const res = await sendToServer("/leastPay", to_server);
    if (res.statusCode === 400 || res.mesg) {
      CreatePopup(undefined, res.mesg ? res.mesg : res.message, "only_check");
    } else {
      this.SetPageVal("result", res);
      this.setCompState && this.setCompState(2);
      setTimeout(() => {
        this.setCompState && this.setCompState(1);
      }, 1000);
    }
  };
}

const handler = new MinimumSalaryHandler({});

const MinimumSalary = () => {
  const [compState, setCompState] = useState(0);
  useEffect(() => {
    handler.setCompState = setCompState;
  });
  return (
    <>
      {compState === 2 ? (
        <Loading />
      ) : (
        <>
          {compState === 0 && (
            <>
              <Header title="정보입력" leftType="BACK" leftLink="/main" />
              <div id="minimum_saraly_container" className="full_height_layout">
                <h2 id="minimum_saraly_title" className="fs_16">
                  최저월급계산기
                </h2>
                <div className="public_side_padding">
                  <NumberUpDown
                    params="workHour"
                    label="근무시간"
                    label_unit="주"
                    unit="시간"
                    max_num={8}
                    typing={false}
                    callBack={handler.SetPageVal}
                  />
                  <NumberUpDown
                    updown_unit={10}
                    max_num={60}
                    typing={false}
                    params="workMin"
                    unit="분"
                    callBack={handler.SetPageVal}
                  />
                  <NumberUpDown
                    params="workDay"
                    label="근무일수"
                    label_unit="주"
                    unit="일"
                    max_num={5}
                    typing={false}
                    callBack={handler.SetPageVal}
                  />
                </div>
                <Button
                  text="계산하기"
                  type="bottom"
                  click_func={handler.Action_MinimumSalary_Cal}
                />
              </div>
            </>
          )}
          {compState === 1 && (
            <ResultComp
              result_data={handler.GetPageVal("result")}
              cal_type="leastPay"
              back_func={() => handler.setCompState && handler.setCompState(0)}
              weekTime={handler._Data.workDay * handler._Data.workHour}
              weekDay={handler._Data.workDay}
            />
          )}
        </>
      )}
    </>
  );
};

export default MinimumSalary;

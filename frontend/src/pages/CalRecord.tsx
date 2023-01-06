import { useState } from "react";
import { Link } from "react-router-dom";
import { CreatePopup } from "../components/common/Popup";
import Button from "../components/inputs/Button";
import Header from "../components/layout/Header";
import "../styles/calrecord.css";

const PrevCal = () => {
  const calResult = localStorage.getItem("cal_result");
  const [calResultArr, setCalResultArr] = useState(
    calResult ? JSON.parse(calResult) : null
  );
  const onClickAllDelete = () => {
    setCalResultArr([]);
    localStorage.setItem("cal_result", JSON.stringify([]));
  };

  return (
    <>
      <Header title="이전 계산 내역" leftType="LOGO" leftLink="/main" />

      {!calResultArr || calResultArr.length <= 0 ? (
        <div id="cal_record_container" className="public_side_padding">
          <div id="nop_cal_record" className="full_height_layout_cal">
            <div className="nop_cal_guide1">계산한 내역이 없습니다.</div>
            <div className="nop_cal_guide2 lh_27">
              <div className="font_family_bold">
                어렵게 생각하지 마세요. <br />
                딸기시럽이 <span>알아서</span>
                계산해드립니다.
              </div>
              <div className="fs_12 lh_27">입사일, 퇴사일만 입력하면 OK</div>
            </div>
          </div>
        </div>
      ) : (
        <div
          id="cal_record_container"
          className="public_side_padding cal_reslut_arr"
        >
          {calResultArr.map((el: any) => {
            const createdAtGen = `${new Date(el.createdAt).getFullYear()}년 ${
              new Date(el.createdAt).getMonth() + 1
            }월 ${new Date(el.createdAt).getDate()}일`;
            return (
              <div
                key={JSON.stringify(el) + Date.now()}
                className="cal_record_card"
              >
                <div className="cal_record_cardtitle font_color_white font_family_bold">
                  실업급여
                </div>
                <div className="font_family_bold">
                  계산일 :<div>{createdAtGen}</div>
                </div>
                <div className="font_family_bold">
                  계산기 : <div>{el.calType}</div>
                </div>
                <div className="font_family_bold">
                  대상여부 : <div className="font_color_main">{el.succ}</div>
                </div>
                {el.succ === "대상자" ? (
                  <>
                    <div className="font_family_bold">
                      근무일수 :<div>{el.workingDays?.toLocaleString()}일</div>
                    </div>
                    <div className="font_family_bold">
                      월 지급액 : <div>{el.monthPay?.toLocaleString()}원</div>
                    </div>
                    <div className="font_family_bold">
                      지급기간 : <div>{el.receiveDay}일</div>
                    </div>
                    <div className="font_family_bold">
                      수령액 : <div>{el.amountCost?.toLocaleString()}원</div>
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => {
                      CreatePopup(
                        "불인정 사유",
                        el.disReason,
                        "only_check",
                        undefined,
                        undefined,
                        "확인"
                      );
                    }}
                    className="dis_reason_container"
                  >
                    <div className="font_family_bold lh_27">사유 : </div>
                    <div className="lh_27">{el.disReason}</div>
                  </div>
                )}
                <div className="receive_card font_color_main font_family_bold">
                  퇴직금
                </div>
                <div className="font_family_bold">
                  대상여부 : <div className="font_color_main">{el.succ}</div>
                </div>
                {el.succ === "대상자" ? (
                  <div className="font_family_bold">
                    금액 : <div>{el.severancePay?.toLocaleString()}원</div>
                  </div>
                ) : (
                  <div className="font_family_bold">
                    사유 : <div>근무일수 부족</div>
                  </div>
                )}
                <div className="cal_reacor_btncontainer">
                  <Button
                    text="삭제하기"
                    type="normal_sub"
                    click_func={() => {
                      const deleteAfterArr = calResultArr.filter((it: any) => {
                        return it.id !== el.id;
                      });
                      setCalResultArr(deleteAfterArr);
                      localStorage.setItem(
                        "cal_result",
                        JSON.stringify(deleteAfterArr)
                      );
                    }}
                  />
                  <Button
                    text="자세히보기"
                    type="normal_main"
                    click_func={() => {}}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div id="company_button_container">
        <Button
          text="모두 삭제하기"
          type="popup_cancel"
          click_func={onClickAllDelete}
        />
        <Link to="/main" className="w_100">
          <Button text="계산하러 가기" type="popup_ok" click_func={() => {}} />
        </Link>
      </div>
    </>
  );
};

export default PrevCal;

import {
  Dispatch,
  Fragment,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import CalContainer from "../components/calculator/CalContainer";
import WorkTypes from "../components/calculator/WorkTypes";
import { ClosePopup, CreatePopup } from "../components/common/popup";
import Button from "../components/inputs/Button";
import Header from "../components/layout/Header";
import DetailedHandler from "../object/detailed";
import EMTDetailArtsSupply from "../assets/image/emoticon/detail_arts_supply.svg";
import EMTDetailSpecialsSupply from "../assets/image/emoticon/detail_specials_supply.svg";
import EMTDetailDayJobSupply from "../assets/image/emoticon/detail_dayjob_supply.svg";
import EMTDetailEmploySupply from "../assets/image/emoticon/detail_employ_supply.svg";
import EMTDetailFullTimeSupply from "../assets/image/emoticon/detail_fulltime_supply.svg";
import EMTDetailContractSupply from "../assets/image/emoticon/detail_contract_supply.svg";
import EMTDetailVeryShortsSupply from "../assets/image/emoticon/detail_veryshort_supply.svg";
import { DetailCalComp } from "./Detailed";

import { getAge } from "../utils/date";
import { sendToServer } from "../utils/sendToserver";
import { ResultComp } from "../components/calculator/Result";
import Loading from "../components/common/Loading";
import { calRecording } from "../utils/calrecord";
import CheckBoxInput from "../components/inputs/Check";
import { DetailPathCal } from "../object/common";
import { CheckValiDation } from "../utils/validate";

import "../styles/multi.css";
import { MultiConfirmPopup } from "../components/calculator/confirmPopup";
import Calendar from "../components/inputs/Calendar";

interface Company {
  id: number;
  content: string;
  emoticon: string | undefined;
}

class MultiCalHandler extends DetailedHandler {
  public setCompanys: Dispatch<SetStateAction<Company[]>> | undefined =
    undefined;
  public setEmoticon: Dispatch<SetStateAction<any>> | undefined = undefined;
  public setCompState: Dispatch<SetStateAction<number>> | undefined = undefined;
  public companys: Company[] | undefined = undefined;
  public to_server: any = [];
  public genericid = 0;
  public Action_cal_multi_unit = async () => {
    const to_server_unit = await this.Action_Cal_Result();
    this.genericid++;
    this.to_server.push({
      ...to_server_unit,
      id: this.genericid,
    });
    this.SetPageVal("addData", this.to_server);
    const select_company = this.companys?.map((el) => {
      if (el.id === this.GetPageVal("select_multi")) {
        return {
          id: el.id,
          content: `${
            this.GetPageVal("retiredDay")
              ? this.GetPageVal("retiredDay")
              : this.GetPageVal("lastWorkDay")
          } 퇴사`,
          emoticon:
            this._Data.workCate === 0 || this._Data.workCate === 1
              ? EMTDetailFullTimeSupply
              : this._Data.workCate === 2 || this._Data.workCate === 4
              ? EMTDetailArtsSupply
              : this._Data.workCate === 3 || this._Data.workCate === 5
              ? EMTDetailSpecialsSupply
              : this._Data.workCate === 6
              ? EMTDetailDayJobSupply
              : this._Data.workCate === 7
              ? EMTDetailVeryShortsSupply
              : this._Data.workCate === 8 && EMTDetailEmploySupply,
        };
      } else {
        return el;
      }
    });
    this.SetPageVal("companys_list", select_company);
  };
}

const handler = new MultiCalHandler({});

const _MultiMainDataSelect = () => {
  return (
    <div
      id="multi_select_container"
      className="public_side_padding full_height_layout_cal"
    >
      <div>실업급여를 신청할 근로 형태를 선택해주세요.</div>
      {handler.companys?.map((el, idx) => {
        if (!el.emoticon) return;
        return (
          <div
            className="multi_mainselect_card fs_16 font_color_main"
            key={String(idx) + el.emoticon}
          >
            <input
              type="radio"
              name="multi_main_select"
              onChange={() => {
                const mainData = handler
                  .GetPageVal("addData")
                  .filter((el2: any) => {
                    return el2.id === el.id;
                  });
                handler.SetPageVal("mainData", mainData);
              }}
            />
            {el.content}
          </div>
        );
      })}
      <Button
        type="bottom"
        text="확인"
        click_func={() => {
          CreatePopup(
            undefined,
            <MultiConfirmPopup
              confirm_data_arr={handler.GetPageVal("addData")}
              mainData={handler.GetPageVal("mainData")[0]}
            />,
            "confirm",
            async () => {
              ClosePopup();
              const mainData = handler.GetPageVal("mainData");
              const addData = handler
                .GetPageVal("addData")
                .filter((el: any) => {
                  return el.id !== mainData[0].id;
                });
              const employData = addData.filter((el: any) => {
                return el.workCate === 8;
              });
              const targetDate = new Date(
                mainData[0].lastWorkDay
                  ? mainData[0].lastWorkDay
                  : mainData[0].retiredDay
              );
              const limitNum =
                mainData[0].workCate === 0 ||
                mainData[0].workCate === 1 ||
                mainData[0].workCate === 6
                  ? 18
                  : 24;
              const limitDay = new Date(
                targetDate.getFullYear(),
                targetDate.getMonth() - limitNum,
                targetDate.getDate()
              );

              const addDataResultArr: any[] = [];
              const url = DetailPathCal(mainData[0].workCate);
              const mainDataResult = await sendToServer(url ? url : "", {
                ...mainData[0],
                age: Number(
                  getAge(new Date(String(handler.GetPageVal("age_multi")))).age
                ),
                disabled:
                  handler.GetPageVal("disabled_multi") === "장애인"
                    ? true
                    : false,
              });

              for (let i = 0; i < addData.length; i++) {
                const url = DetailPathCal(addData[i].workCate);
                const result = await sendToServer(url ? url : "", {
                  ...addData[i],
                  limitDay,
                  age: Number(
                    getAge(new Date(String(handler.GetPageVal("age_multi"))))
                      .age
                  ),
                  disabled:
                    handler.GetPageVal("disabled_multi") === "장애인"
                      ? true
                      : false,
                });
                let permitDays = result.workDayForMulti;
                if (handler.GetPageVal("dayJobPermitDay")) {
                  permitDays = handler.GetPageVal("dayJobPermitDay")
                    ? handler.GetPageVal("dayJobPermitDay")
                    : 0;
                }
                if (handler.GetPageVal("shortsPermitDay")) {
                  permitDays = handler.GetPageVal("shortsPermitDay")
                    ? handler.GetPageVal("shortsPermitDay")
                    : 0;
                }
                addDataResultArr.push({
                  workCate: addData[i].workCate,
                  isIrregular: addData[i].isSimple
                    ? addData[i].isSimple
                    : false,
                  enterDay: addData[i].enterDay
                    ? addData[i].enterDay
                    : addData[i].lastWorkDay,
                  retiredDay: addData[i].retiredDay
                    ? addData[i].retiredDay
                    : addData[i].lastWorkDay,
                  workingDays: result.workingDays
                    ? result.workingDays
                    : result.workingMonths,
                  permitDays,
                });
              }

              const multi_to_server = {
                mainData: {
                  age: Number(
                    getAge(new Date(String(handler.GetPageVal("age_multi"))))
                      .age
                  ),
                  disabled:
                    handler.GetPageVal("disabled_multi") === "장애인"
                      ? true
                      : false,
                  workCate: mainData[0].workCate,
                  isIrregular: mainData[0].isSimple
                    ? mainData[0].isSimple
                    : false,
                  enterDay: mainData[0].enterDay
                    ? mainData[0].enterDay
                    : mainData[0].lastWorkDay,
                  retiredDay: mainData[0].retiredDay
                    ? mainData[0].retiredDay
                    : mainData[0].lastWorkDay,
                  workingDays: mainDataResult.workingDays
                    ? mainDataResult.workingDays
                    : mainDataResult.workingMonths,
                  dayAvgPay: mainDataResult.dayAvgPay
                    ? mainDataResult.dayAvgPay
                    : 0,
                  realDayPay: mainDataResult.realDayPay,
                },
                addData: addDataResultArr,
              };
              const result = await sendToServer(
                employData.length > 0 || mainData[0].workCate === 8
                  ? "/multi/employer"
                  : "/multi",
                multi_to_server
              );

              if (result?.checkResult?.succ === false) {
                CreatePopup(
                  undefined,
                  result.checkResult.mesg ? result.checkResult.mesg : "",
                  "only_check"
                );
                return;
              }
              handler.setCompState && handler.setCompState(5);
              setTimeout(() => {
                handler.setCompState && handler.setCompState(6);
              }, 1000);
              handler.SetPageVal("result", result);
              calRecording(result, "복수형");
            }
          );
        }}
      />
    </div>
  );
};

const _MultiCalListCard = ({
  company,
  list_num,
}: {
  company: Company;
  list_num: number;
}) => {
  const onClickCompanyDelete = (e: MouseEvent<HTMLDivElement>) => {
    const targetId = e.currentTarget.id;
    CreatePopup(
      undefined,
      "삭제한 근로 정보는 다시 복구할 수 없습니다.정말 삭제하시겠습니까?",
      "confirm",
      () => {
        if (!handler.companys || !handler.setCompanys) return;
        const cur_companys = handler.companys.filter((el) => {
          return String(el.id) !== String(targetId.split("_")[0]);
        });
        handler.setCompanys && handler.setCompanys(cur_companys);
        ClosePopup();
      }
    );
  };
  return (
    <div className="company_list">
      <div
        id={`${String(company.id)}_delete`}
        onClick={onClickCompanyDelete}
        className="delete_mark"
      >
        <span></span>
      </div>
      <div className="font_color_main fs_16">
        {company.content ? company.content : `${list_num + 1}번 회사`}
      </div>
      <div className="font_color_main fs_14">
        <div
          id={`${String(company.id)}_inputs`}
          className="font_color_main fs_14"
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            handler.SetPageVal(
              "select_multi",
              Number(e.currentTarget.id.split("_")[0])
            );
            handler.GetPageVal("select_multi");
            handler.setCompState && handler.setCompState(2);
          }}
        >
          {company.content ? "수정 >" : "입력 >"}
        </div>
      </div>
    </div>
  );
};

const _MultiCompanyList = () => {
  const [companys, setCompanys] = useState<Company[]>(
    handler.GetPageVal("companys_list")
      ? handler.GetPageVal("companys_list")
      : [
          {
            id: 1,
            content: "",
            emoticon: "",
          },
          {
            id: 2,
            content: "",
            emoticon: "",
          },
        ]
  );
  useEffect(() => {
    handler.companys = companys;
  }, [companys]);
  useEffect(() => {
    handler.setCompanys = setCompanys;
    handler.SetPageVal("disabled_multi", "비장애인");
  }, []);
  return (
    <>
      <div id="multi_top_container">
        <div>
          {companys.map((el, idx) => {
            return (
              <Fragment key={String(idx) + el.emoticon}>
                {el.emoticon && (
                  <img
                    className="multi_top_emoticon"
                    src={el.emoticon}
                    alt="company work category images"
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
      <div className="public_side_padding">
        <Calendar
          params="age_multi"
          label="생년월일"
          handler={handler}
          selected={handler._Data.age_multi ? handler._Data.age_multi : ""}
        />
        <CheckBoxInput
          type="circle_type"
          params="disabled_multi"
          callBack={handler.SetPageVal}
          label="장애여부"
          selected={
            handler._Data.disabled_multi
              ? handler._Data.disabled_multi
              : "비장애인"
          }
          options={["장애인", "비장애인"]}
        />
      </div>
      <div id="multi_company_list" className="public_side_padding">
        {companys.map((el, idx) => {
          return (
            <_MultiCalListCard
              key={el.content + String(el.id)}
              company={el}
              list_num={idx}
            />
          );
        })}
        <button
          id="company_add_btn"
          onClick={() => {
            if (companys.length > 4) {
              CreatePopup(
                undefined,
                "회사 근무 정보는 5개까지 입력할 수 있습니다.",
                "only_check"
              );
              return;
            }
            setCompanys([
              ...companys,
              {
                id: companys.length + 1,
                content: "",
                emoticon: undefined,
              },
            ]);
            handler.SetPageVal("companys_list", companys);
          }}
        >
          <div className="add_mark">
            <span></span>
            <span></span>
          </div>
          <div className="font_color_main fs_16">회사 추가</div>
        </button>
      </div>
    </>
  );
};

const MultiCalPage = () => {
  const [compState, setCompState] = useState(1);
  handler.setCompState = setCompState;
  handler.SetPageVal("cal_state", "multi");
  handler.SetPageVal("retired", true);
  // useEffect(() => {
  //   return () =>
  //     handler.SetPageVal("companys_list", [
  //       [
  //         {
  //           id: 1,
  //           content: "",
  //           emoticon: "",
  //         },
  //         {
  //           id: 2,
  //           content: "",
  //           emoticon: "",
  //         },
  //       ],
  //     ]);
  // });
  return (
    <>
      {compState === 5 ? (
        <Loading />
      ) : (
        <CalContainer type="복수형" GetValue={handler.GetPageVal}>
          <>
            <Header
              title="정보 입력"
              leftLink="/main"
              leftType="BACK"
              leftFunc={
                compState === 1
                  ? undefined
                  : () => {
                      handler.setCompState && handler.setCompState(1);
                    }
              }
            />
            {compState === 1 && (
              <>
                <div id="multi_container">
                  <_MultiCompanyList />
                </div>
                <div id="company_button_container">
                  <Button
                    text="초기화"
                    type="popup_cancel"
                    click_func={() => {
                      CreatePopup(
                        undefined,
                        "입력했던 모든 근로 정보들이 초기화 됩니다.",
                        "confirm",
                        () => {
                          handler.setCompanys &&
                            handler.setCompanys([
                              {
                                id: 1,
                                content: "",
                                emoticon: "",
                              },
                              {
                                id: 2,
                                content: "",
                                emoticon: "",
                              },
                            ]);
                          ClosePopup();
                        }
                      );
                    }}
                  />
                  <Button
                    text="계산하기"
                    type="popup_ok"
                    click_func={() => {
                      if (
                        !CheckValiDation("multi_one", {
                          disabled:
                            handler.GetPageVal("disabled_multi") || null,
                          age: handler.GetPageVal("age_multi") || null,
                          companys_list: handler.GetPageVal("companys_list"),
                        })
                      )
                        return;
                      handler.setCompState && handler.setCompState(4);
                    }}
                  />
                </div>
              </>
            )}
            {compState === 2 && <WorkTypes handler={handler} />}
            {compState === 3 && (
              <DetailCalComp
                handler={handler}
                workCate={handler.GetPageVal("workCate")}
                clickCallBack={() => {
                  handler.Action_cal_multi_unit();
                }}
              />
            )}
            {compState === 4 && <_MultiMainDataSelect />}
            {compState === 6 && (
              <ResultComp
                cal_type="multi"
                result_data={handler.GetPageVal("result")}
                back_func={() =>
                  handler.setCompState && handler.setCompState(4)
                }
              />
            )}
          </>
        </CalContainer>
      )}
    </>
  );
};

export default MultiCalPage;

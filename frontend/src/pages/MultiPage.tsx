import {
  Dispatch,
  Fragment,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import CalContainer from "../components/calculator/CalContainer";
import { WorkCatePopup } from "../components/calculator/WorkTypes";
import { ClosePopup } from "../components/common/Popup";
import Button from "../components/inputs/Button";
import Header from "../components/layout/Header";
import DetailedHandler from "../object/detailed";
import EMTDetailArtsSupply from "../assets/image/emoticon/detail_arts_supply.svg";
import EMTDetailSpecialsSupply from "../assets/image/emoticon/detail_specials_supply.svg";
import EMTDetailDayJobSupply from "../assets/image/emoticon/detail_dayjob_supply.svg";
import EMTDetailEmploySupply from "../assets/image/emoticon/detail_employ_supply.svg";
import EMTDetailFullTimeSupply from "../assets/image/emoticon/detail_fulltime_supply.svg";
import EMTDetailVeryShortsSupply from "../assets/image/emoticon/detail_veryshort_supply.svg";
import { DetailCalComp } from "./Detailed";
import "../styles/multi.css";
import { getAge } from "../utils/date";
import { sendToServer } from "../utils/sendToserver";
import { ResultComp } from "../components/calculator/Result";
import Loading from "../components/common/Loading";

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
  public Action_cal_multi_unit = async () => {
    const to_server_unit = await this.Action_Cal_Result();
    this.to_server.push({
      ...to_server_unit,
      id: this.GetPageVal("select_multi"),
      input: this.GetPageVal("input")
        ? this.GetPageVal("input") === "개별 입력"
          ? true
          : false
        : false,
      retiredDay: this.GetPageVal("retiredDay"),
      enterDay: this.GetPageVal("enterDay"),
      workCate: this.GetPageVal("workCate"),
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
    if (to_server_unit.hasOwnProperty("succ")) {
      this.setCompState && this.setCompState(1);
    } else {
      return;
    }
  };
}

const _MultiMainDataSelect = () => {
  return (
    <div
      id="multi_select_container"
      className="public_side_padding full_height_layout_cal"
    >
      <div>실업급여를 신청할 근로 형태를 선택해주세요.</div>
      {handler.companys?.map((el, idx) => {
        return (
          <div
            className="multi_mainselect_card fs_16 font_color_main"
            key={String(idx) + el.emoticon}
          >
            <input
              type="radio"
              name="multi_main_select"
              onChange={() => {
                const maindata = handler.to_server.filter((it: any) => {
                  return it.id === el.id;
                });
                handler.SetPageVal("mainData", {
                  workCate: handler._Data.workCate,
                  isIrregular: maindata[0].input,
                  age: isNaN(
                    Number(getAge(new Date(String(handler._Data.age))).age)
                  )
                    ? null
                    : getAge(new Date(String(handler._Data.age))).age,
                  disabled: handler._Data.disabled === "장애인" ? true : false,
                  workingDays: maindata[0].workingDays,
                  enterDay: handler._Data.enterDay,
                  retiredDay: handler._Data.retiredDay,
                  dayAvgPay: maindata[0].dayAvgPay,
                  realDayPay: maindata[0].realDayPay,
                  id: maindata[0].id,
                });
              }}
            />
            {el.content}
          </div>
        );
      })}
      <Button
        type="bottom"
        text="확인"
        click_func={async () => {
          const mainData = handler.GetPageVal("mainData");
          const addData = handler
            .GetPageVal("addData")
            .filter((el: any) => {
              return mainData.id !== el.id;
            })
            .map((el: any) => {
              return {
                workCate: el.workCate,
                isIrregular: el.input,
                enterDay: el.enterDay,
                retiredDay: el.retiredDay,
                workingDays: el.workingDays,
                permitDays: el.workDayForMulti,
              };
            });
          const final_to_server = {
            mainData,
            addData,
          };
          const result = await sendToServer("/multi", final_to_server);
          handler.setCompState && handler.setCompState(5);
          setTimeout(() => {
            handler.setCompState && handler.setCompState(4);
          }, 2000);
          handler.SetPageVal("result", result);
        }}
      />
    </div>
  );
};

const handler = new MultiCalHandler({});

const _MultiCalListCard = ({ company }: { company: Company }) => {
  const onClickCompanyDelete = (e: MouseEvent<HTMLDivElement>) => {
    if (!handler.companys || !handler.setCompanys) return;
    const cur_companys = handler.companys.filter((el) => {
      return String(el.id) !== String(e.currentTarget.id.split("_")[0]);
    });
    handler.setCompanys && handler.setCompanys(cur_companys);
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
      <div className="font_color_main fs_16"> {company.content}</div>
      <div className="font_color_main fs_14">
        <WorkCatePopup
          handler={handler}
          popUpCallBack={(params: string, value: string) => {
            handler.SetPageVal(params, value);
            handler.setCompState && handler.setCompState(2);
            if (value === undefined) handler.SetPageVal(params, 0);
            ClosePopup();
          }}
          popup_focus_template={
            <div
              id={`${String(company.id)}_inputs`}
              className="font_color_main fs_14"
              onClick={(e: MouseEvent<HTMLDivElement>) => {
                handler.SetPageVal(
                  "select_multi",
                  Number(e.currentTarget.id.split("_")[0])
                );
                handler.GetPageVal("select_multi");
              }}
            >
              입력
            </div>
          }
        />
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
            content: "1번 회사",
            emoticon: "",
          },
          {
            id: 2,
            content: "2번 회사",
            emoticon: "",
          },
        ]
  );
  useEffect(() => {
    handler.companys = companys;
  }, [companys]);
  useEffect(() => {
    handler.setCompanys = setCompanys;
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
      <div id="multi_company_list" className="public_side_padding">
        {companys.map((el) => {
          return (
            <_MultiCalListCard key={el.content + String(el.id)} company={el} />
          );
        })}
        <button
          id="company_add_btn"
          onClick={() => {
            setCompanys([
              ...companys,
              {
                id: companys.length + 1,
                content: `${companys.length + 1}번 회사`,
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
  useEffect(() => {
    handler.setCompState = setCompState;
    handler.SetPageVal("cal_state", "multi");
    handler.SetPageVal("retired", true);
  }, []);

  return (
    <>
      {compState === 5 ? (
        <Loading />
      ) : (
        <CalContainer type="복수형" GetValue={handler.GetPageVal}>
          <>
            <Header title="정보 입력" leftLink="/main" leftType="BACK" />
            {compState === 1 && (
              <>
                <div id="multi_container">
                  <_MultiCompanyList />
                </div>
                <div id="company_button_container">
                  <Button
                    text="초기화"
                    type="popup_cancel"
                    click_func={() => {}}
                  />
                  <Button
                    text="계산하기"
                    type="popup_ok"
                    click_func={() =>
                      handler.setCompState && handler.setCompState(3)
                    }
                  />
                </div>
              </>
            )}
            {compState === 2 && (
              <DetailCalComp
                handler={handler}
                workCate={handler.GetPageVal("workCate")}
                clickCallBack={() => {
                  handler.Action_cal_multi_unit();
                }}
              />
            )}
            {compState === 3 && <_MultiMainDataSelect />}
            {compState === 4 && (
              <ResultComp
                cal_type="multi"
                result_data={handler.GetPageVal("result")}
              />
            )}
          </>
        </CalContainer>
      )}
    </>
  );
};

export default MultiCalPage;

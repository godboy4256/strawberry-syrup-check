import { MouseEventHandler, useEffect, useState } from "react";
import {
  retire_reason_standard,
  retire_reason_popup,
  work_cate,
  retire_reason_art,
  retire_reason_dayjob,
  retire_reason_employ,
} from "../../assets/data/worktype_data";
import { ClosePopup, CreatePopup } from "../common/Popup";
import SelectInput from "../inputs/Select";
import Header from "../layout/Header";
import IMGWorkTypeSelect from "./../../assets/image/new/detail_info01_select.svg";
import IMGWorkTypeUnSelect from "./../../assets/image/new/detail_info01_unselect.svg";

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
      ...handler._Data,
      retired: handler._Data.retired,
    };
    handler.SetPageVal("workCate", undefined);
    handler.SetPageVal("retireReason", undefined);
  }, []);
  const [workCate, setWorkCate] = useState<number | string>(0);
  const [workRypeInfo1, setState1] = useState<"select" | "next" | "none">(
    "next"
  );
  const [workRypeInfo2, setState2] = useState<"select" | "next" | "none">(
    "none"
  );
  const [workRypeInfo3, _] = useState<"select" | "next" | "none">("none");
  const popUpCallBack = (params: string, value: string | number) => {
    handler.SetPageVal(params, value);
    if (value === undefined) {
      handler.SetPageVal(params, 0);
    }
    if (params === "workCate") {
      setState1("select");
      setWorkCate(value);
    } else {
      setState2("select");
    }
    ClosePopup();
  };
  return (
    <>
      <Header
        title="정보입력"
        leftLink="/main"
        leftType="BACK"
        leftFunc={() => {
          handler.setCompState(1);
          handler.SetPageVal("retired", undefined);
        }}
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
            popUpCallBack={popUpCallBack}
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
            options={
              workCate === 0 || workCate === undefined
                ? retire_reason_standard
                : workCate === 1 || workCate === 2 || workCate === 3
                ? retire_reason_art
                : workCate === 4 || workCate === 1 || workCate === 5
                ? retire_reason_dayjob
                : retire_reason_employ
            }
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
                handler.GetPageVal("retireReason") !== undefined
              ) {
                if (handler.cal_state === "multi") {
                  handler.setCompState(2);
                } else {
                  handler.setCompState(3);
                }
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

import { MouseEventHandler, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  duplicationDateCheck,
  duplicationWorkRecord,
} from "../../assets/atom/multi";
import {
  retire_reason_standard,
  work_cate,
  retire_reason_art,
  retire_reason_dayjob,
  retire_reason_employ,
  retire_reason_standard_popup,
  retire_reason_art_popup,
  retire_reason_dayjob_popup,
} from "../../assets/data/worktype_data";
import { ClosePopup, CreatePopup } from "../common/popup";
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
        <div className="flex_left fs_14 un_value_font_color">
          {selectState === "select" ? "수정 >" : "입력 >"}
        </div>
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

const WorkTypes = ({ handler }: { handler: any }) => {
  useEffect(() => {
    handler._Data = {
      ...handler._Data,
      retired: handler._Data.retired,
    };
  }, []);
  const [workCate, setWorkCate] = useState<number | string>(0);
  const [workRypeInfo1, setState1] = useState<"select" | "next" | "none">(
    "next"
  );
  const [workRypeInfo2, setState2] = useState<"select" | "next" | "none">(
    "none"
  );
  const [workRypeInfo3, _] = useState<"select" | "next" | "none">("none");
  const [check_select_date, setState3] =
    useRecoilState<any>(duplicationDateCheck);
  const [check_select_months, setState4] = useRecoilState<any>(
    duplicationWorkRecord
  );
  const popUpCallBack = (params: string, value: string | number) => {
    handler.SetPageVal(params, value);
    if (value === undefined) {
      handler.SetPageVal(params, 0);
    }
    if (params === "workCate") {
      setState1("select");
      setState2("none");
      handler.SetPageVal("retireReason", undefined);
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
          if (
            handler.GetPageVal("cal_state") === "multi" &&
            handler.companys &&
            handler.companys[handler.GetPageVal("select_multi")].content
          ) {
            const arr = [];
            const arr2 = [];
            arr.push(...check_select_date);
            arr.push(
              ...handler.GetPageVal(
                `select_multi_${Number(handler.GetPageVal("select_multi"))}`
              ).date_info
            );
            arr2.push(...check_select_months);
            arr2.push(
              ...handler.GetPageVal(
                `select_multi_${Number(handler.GetPageVal("select_multi"))}`
              ).date_month_info
            );
            console.log(
              "ddd",
              handler.GetPageVal(
                `select_multi_${Number(handler.GetPageVal("select_multi"))}`
              ).date_month_info
            );
            console.log(
              "ddd",
              handler.GetPageVal(
                `select_multi_${Number(handler.GetPageVal("select_multi"))}`
              ).date_info
            );
            setState3(arr);
            setState4(arr2);
            console.log(arr, arr2);
            console.log(Number(handler.GetPageVal("select_multi")));
          }
        }}
      />
      <div id="detail_container_comp1" className="full_height_layout_cal">
        <div className="public_side_padding">
          <SelectInput
            label="근로형태 선택"
            popUpCallBack={popUpCallBack}
            callBack={handler.SetPageVal}
            popup_focus_template={
              <_CompSelectTemplete
                level={1}
                name="근로형태 선택"
                selectState={workRypeInfo1}
              />
            }
            popup_select={handler.GetPageVal}
            params="workCate"
            options={work_cate}
            type="popup"
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
                : workCate === 2 || workCate === 3
                ? retire_reason_art
                : workCate === 4 || workCate === 1 || workCate === 5
                ? retire_reason_dayjob
                : retire_reason_employ
            }
            check_popup={
              workCate === 0 || workCate === undefined
                ? retire_reason_standard_popup
                : workCate === 2 || workCate === 3
                ? retire_reason_art_popup
                : workCate === 4 || workCate === 1 || workCate === 5
                ? retire_reason_dayjob_popup
                : "employ"
            }
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

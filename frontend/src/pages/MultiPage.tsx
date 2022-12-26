import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import CalContainer from "../components/calculator/CalContainer";
import WorkTypes, { WorkCatePopup } from "../components/calculator/WorkTypes";
import { ClosePopup } from "../components/common/Popup";
import Button from "../components/inputs/Button";
import Header from "../components/layout/Header";
import DetailedHandler from "../object/detailed";
import "../styles/multi.css";
import { DetailCalComp } from "./Detailed";

interface Company {
  id: number;
  content: string;
}

class MultiCalHandler extends DetailedHandler {
  public result: any = {};
  public to_server: any[] = [];
  public companys: Company[] | undefined = undefined;
  public setCompanys: Dispatch<SetStateAction<Company[]>> | undefined =
    undefined;
  public setCompState: Dispatch<SetStateAction<number>> | undefined = undefined;
  public Action_cal_multi_unit = () => {
    this.Action_Cal_Result();
    this.setCompState && this.setCompState(2);
    this.to_server.push({
      ...this.result,
      workCate: this._Data.workCate,
    });
    console.log(this.to_server);
    console.log(this.result);
  };
}
const handler = new MultiCalHandler({});

const _MultiCalListCart = ({ company }: { company: Company }) => {
  const onClickCompanyDelete = (e: MouseEvent<HTMLDivElement>) => {
    if (!handler.companys || !handler.setCompanys) return;
    const cur_companys = handler.companys.filter((el) => {
      return String(el.id) !== e.currentTarget.id;
    });
    handler.setCompanys && handler.setCompanys(cur_companys);
  };
  return (
    <div className="company_list">
      <div
        id={String(company.id)}
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
            handler.setCompState && handler.setCompState(3);
            if (value === undefined) handler.SetPageVal(params, 0);
            ClosePopup();
          }}
          popup_focus_template={
            <div className="font_color_main fs_14">입력 {">"}</div>
          }
        />
      </div>
    </div>
  );
};

const _MultiCompanyList = () => {
  const [companys, setCompanys] = useState<Company[]>([
    { id: 1, content: "1번 회사" },
    { id: 2, content: "2번 회사" },
  ]);
  useEffect(() => {
    handler.companys = companys;
    handler.setCompanys = setCompanys;
  });
  return (
    <div id="multi_company_list" className="public_side_padding">
      {companys.map((el) => {
        return (
          <_MultiCalListCart key={el.content + String(el.id)} company={el} />
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
            },
          ]);
        }}
      >
        <div className="add_mark">
          <span></span>
          <span></span>
        </div>
        <div className="font_color_main fs_16">회사 추가</div>
      </button>
    </div>
  );
};

const MultiCalPage = () => {
  const [emoticon, setEmoticon] = useState([]);
  const [compState, setCompState] = useState(1);
  useEffect(() => {
    handler.setCompState = setCompState;
    handler.SetPageVal("cal_state", "multi");
  });
  return (
    <CalContainer type="복수형" GetValue={handler.GetPageVal}>
      <>
        <Header title="정보 입력" leftLink="/main" leftType="BACK" />
        {compState === 1 && (
          <>
            <div className="full_height_layout_cal">
              <div id="multi_top_container">
                <div>
                  {emoticon.map((el) => {
                    return (
                      <div>
                        <img src={el} alt="company work category images" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <_MultiCompanyList />
            </div>
            <div id="company_button_container">
              <Button text="초기화" type="popup_cancel" click_func={() => {}} />
              <Button text="계산하기" type="popup_ok" click_func={() => {}} />
            </div>
          </>
        )}
        {compState === 2 && <WorkTypes handler={handler} />}
        {compState === 3 && (
          <DetailCalComp
            handler={handler}
            workCate={handler.GetPageVal("workCate")}
            clickCallBack={() => handler.Action_cal_multi_unit()}
          />
        )}
      </>
    </CalContainer>
  );
};

export default MultiCalPage;

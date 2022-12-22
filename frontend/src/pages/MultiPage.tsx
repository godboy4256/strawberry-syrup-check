import { useState } from "react";
import CalContainer from "../components/calculator/CalContainer";
import Button from "../components/inputs/Button";
import Header from "../components/layout/Header";
import InputHandler from "../object/Inputs";
import "../styles/multi.css";

class MultiCalHandler extends InputHandler {}
const handler = new MultiCalHandler({});

const _MultiCalListCart = ({ company }: { company: string }) => {
  return (
    <div className="company_list">
      <div className="delete_mark">
        <span></span>
      </div>
      <div className="font_color_main fs_16"> {company}</div>
      <div className="font_color_main fs_14">입력 {">"}</div>
    </div>
  );
};

const MultiCalPage = () => {
  const [companys, setCompanys] = useState(["1번 회사", "2번 회사"]);
  const [emoticon, setEmoticon] = useState([]);
  return (
    <CalContainer type="복수형" GetValue={handler.GetPageVal}>
      <>
        <Header
          title={handler.GetPageVal("retired") ? "퇴직자" : "퇴직예정자"}
          leftLink="/"
          leftType="BACK"
        />
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
          <div id="multi_company_list" className="public_side_padding">
            {companys.map((el) => {
              return <_MultiCalListCart company={el} />;
            })}
            <button id="company_add_btn">
              <div className="add_mark">
                <span></span>
                <span></span>
              </div>
              <div className="font_color_main fs_16">회사 추가</div>
            </button>
          </div>
        </div>
        <div id="company_button_container">
          <Button text="초기화" type="popup_cancel" click_func={() => {}} />
          <Button text="계산하기" type="popup_ok" click_func={() => {}} />
        </div>
      </>
    </CalContainer>
  );
};

export default MultiCalPage;

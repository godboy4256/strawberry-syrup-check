import Button from "../inputs/Button";
import IMGBasicEmoticon from "../../assets/image/new/basic.svg";
import HelpLink from "../common/HelpLink";
import "../../styles/retiree.css";
import { useEffect } from "react";
import Header from "../layout/Header";
const CalIsRetiree = ({ handler }: { handler: any }) => {
  useEffect(() => {
    handler._Data = {};
  }, []);
  const onClickIsRetiree = (isRetiree: boolean) => {
    handler.SetPageVal("retired", isRetiree);
    handler.setCompState(2);
  };
  return (
    <div className="full_height_layout_cal">
      <Header title="퇴직자 vs 퇴직예정자" leftLink="/main" leftType="BACK" />
      <div id="retiree_container">
        <div id="retiree_main">
          <div id="strobarry_character">
            <img src={IMGBasicEmoticon} alt="Basic Strawberry Emoticon" />
          </div>
          <Button
            type="normal_main"
            text="퇴직자"
            click_func={() => onClickIsRetiree(true)}
            description="이미 퇴직한 당신을 위한 실업급여는?"
          />
          <Button
            type="normal_main"
            text="퇴직예정자"
            click_func={() => onClickIsRetiree(false)}
            description="재직중이지만 실업급여가 궁금하다면?"
          />
        </div>
        <HelpLink
          text="퇴직사유 알아보기"
          link="/help/3"
          direction="l"
          className="pd_810"
        />
      </div>
    </div>
  );
};

export default CalIsRetiree;

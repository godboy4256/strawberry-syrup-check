import React, { useState } from "react";
import Button from "../inputs/button";
import "../../styles/retiree_container.css";

const CalIsRetiree = ({ type }: { type: "basic" | "detail" | "multi" }) => {
  const [currnetView, setCurrnetView] = useState<string>("block");
  const onClickRetiree = () => {
    setCurrnetView("none");
  };
  return (
    <div id="retiree_container">
      <div id="retiree_type">{type}</div>
      <div id="retiree_main">
        <div id="retiree_image"></div>
        <Button type="normal_main" text="퇴직자" click_func={onClickRetiree} />
        <p className="fs_14">이미 퇴직한 당신을 위한 실업급여는?</p>
        <Button
          type="normal_main"
          text="퇴직예정자"
          click_func={onClickRetiree}
        />
        <p className="fs_14">재직중이지만 실업급여가 궁금하다면?</p>
      </div>
      <button id="retiree_help_routes">퇴직사유 알아보기</button>
    </div>
  );
};

export default CalIsRetiree;

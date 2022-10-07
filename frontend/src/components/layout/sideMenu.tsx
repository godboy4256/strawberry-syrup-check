import React from "react";
import "../../styles/sidemenu.css";

const SideMenu = () => {
  return (
    <nav id="sidemenu_container" className="bg_color_white">
      <button>기본형</button>
      <button>상세형</button>
      <button>복수형</button>
      <button>서식자료실</button>
      <button>도움말</button>
      <button>이전 계산 내역</button>
    </nav>
  );
};

export default SideMenu;

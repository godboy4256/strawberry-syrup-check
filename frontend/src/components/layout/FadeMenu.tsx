import IMGBasicIcon from "../../assets/image/new/main_basic_icon.svg";
import IMGDetailIcon from "../../assets/image/new/main_detail_icon.svg";
import IMGMultiIcon from "../../assets/image/new/main_multi_icon02.svg";
import IMGMenuDownIcon from "../../assets/image/fade_menu_down.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../../styles/sidemenu.css";

const CalMenu = () => {
  return (
    <>
      <Link to="/standard" className="cal_menu_list font_family_bold">
        <img src={IMGBasicIcon} alt="Basic Icon" />
        기본형
      </Link>
      <Link to="/detailed" className="cal_menu_list font_family_bold">
        <img src={IMGDetailIcon} alt="Basic Icon" />
        상세형
      </Link>
      <Link to="/multi" className="multi cal_menu_list font_family_bold">
        <img src={IMGMultiIcon} alt="Basic Icon" />
        복수형
      </Link>
    </>
  );
};

const FadeMenu = () => {
  const [cals, setCals] = useState(false);
  return (
    <nav id="sidemenu_container" className="bg_color_white">
      <div id="fade_cal_menu">
        <button onClick={() => setCals((prev) => !prev)}>
          <div className="font_family_bold">계산하기</div>
          <img src={IMGMenuDownIcon} alt="menu down icon" />
        </button>
        {cals && <CalMenu />}
      </div>
      <Link to="/minimum_salary" className="font_family_bold">
        최저월급계산기
      </Link>
      <Link to="/" className="font_family_bold">
        서식자료실
      </Link>
      <Link to="/help/1" className="font_family_bold">
        도움말
      </Link>
      <Link to="/calrecord" className="font_family_bold">
        이전 계산 내역
      </Link>
    </nav>
  );
};

export default FadeMenu;

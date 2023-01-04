import IMGBasicIcon from "../../assets/image/new/main_basic_icon.svg";
import IMGDetailIcon from "../../assets/image/new/main_detail_icon.svg";
import IMGMultiIcon from "../../assets/image/new/main_multi_icon02.svg";
import { Link } from "react-router-dom";
import "../../styles/sidemenu.css";

const SideMenu = () => {
  return (
    <nav id="sidemenu_container" className="bg_color_white">
      <Link to="/standard" className="font_family_bold">
        <img src={IMGBasicIcon} alt="Basic Icon" />
        기본형
      </Link>
      <Link to="/detailed" className="font_family_bold">
        <img src={IMGDetailIcon} alt="Basic Icon" />
        상세형
      </Link>
      <Link to="/multi" className="multi font_family_bold">
        <img src={IMGMultiIcon} alt="Basic Icon" />
        복수형
      </Link>
      <Link to="/" className="font_family_bold">
        서식자료실
      </Link>
      <Link to="/" className="font_family_bold">
        도움말
      </Link>
      <Link to="/calrecord" className="font_family_bold">
        이전 계산 내역
      </Link>
    </nav>
  );
};

export default SideMenu;

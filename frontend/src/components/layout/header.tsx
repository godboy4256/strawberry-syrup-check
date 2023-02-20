import { useState } from "react";
import { Link } from "react-router-dom";
import IMGBack from "../../assets/image/new/header_back.svg";
import IMGLogo from "../../assets/image/logo.svg";
import FadeMenu from "./FadeMenu";
import "../../styles/header.css";

const Header = ({
  title,
  leftType,
  leftFunc,
  leftLink,
}: {
  title?: string;
  leftType?: "BACK" | "LOGO";
  leftFunc?: () => void | undefined;
  leftLink?: string;
}) => {
  const [onMenu, setOnMenu] = useState(false);
  const onClickMenu = () => {
    setOnMenu((prev) => !prev);
  };
  return (
    <>
      <header
        id="header_container"
        className={`bg_color_white ${onMenu ? "active" : ""} `}
      >
        {leftFunc ? (
          <div onClick={leftFunc}>
            <img
              id="header_left_contents"
              src={leftType === "LOGO" ? IMGLogo : IMGBack}
              alt="Go Back Button"
            />
          </div>
        ) : (
          <Link to={leftLink ? leftLink : "/"}>
            <img
              id="header_left_contents"
              src={leftType === "LOGO" ? IMGLogo : IMGBack}
              alt="Go Back Button"
            />
          </Link>
        )}
        <h1 className="font_color_main font_family_bold">
          {onMenu ? "메뉴" : title}
        </h1>
        <button
          id="header_menu_btn"
          className={onMenu ? "active" : ""}
          onClick={onClickMenu}
        >
          <span className="bg_color_main"></span>
          <span className="bg_color_main"></span>
          <span className="bg_color_main"></span>
        </button>
      </header>
      {onMenu && <FadeMenu />}
    </>
  );
};

export default Header;

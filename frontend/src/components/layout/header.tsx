import React, { useState } from "react";
import { Link } from "react-router-dom";
import IMGBack from "../../assets/img/header_back.svg";
import IMGLogo from "../../assets/img/logo.svg";
import "../../styles/header.css";
import SideMenu from "./sideMenu";

const Header = ({ title, leftType, leftLink }: { title?: string; leftType?: string; leftLink?: string }) => {
	const [onMenu, setOnMenu] = useState(false);
	const onClickMenu = () => {
		setOnMenu((prev) => !prev);
	};
	return (
		<>
			<header id="header_container" className={`bg_color_white ${onMenu ? "active" : ""} `}>
				<Link to={leftLink}>
					<img id="header_left_contents" src={leftType === "LOGO" ? IMGLogo : IMGBack} alt="Go Back Button" />
				</Link>
				<h1 className="font_color_main">{onMenu ? "메뉴" : title}</h1>
				<button id="header_menu_btn" className={onMenu ? "active" : ""} onClick={onClickMenu}>
					<span className="bg_color_main"></span>
					<span className="bg_color_main"></span>
					<span className="bg_color_main"></span>
				</button>
			</header>
			{onMenu && <SideMenu />}
		</>
	);
};

export default Header;

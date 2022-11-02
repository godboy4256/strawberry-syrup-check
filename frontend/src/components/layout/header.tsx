import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IMGBack from "../../assets/img/back_arrow.svg";
import IMGLogo from "../../assets/img/logo.png";
import "../../styles/header.css";
import SideMenu from "./sideMenu";

const Header = ({ leftType }: { leftType: string }) => {
	const [onMenu, setOnMenu] = useState(false);
	const onClickMenu = () => {
		setOnMenu((prev) => !prev);
	};
	return (
		<>
			<header id="header_container" className={`bg_color_white ${onMenu ? "active" : ""} `}>
				<Link to="/">
					<img id="header_left_contents" src={leftType === "logo" ? IMGLogo : IMGBack} alt="Go Back Button" />
				</Link>
				<h1 className="font_color_main">{onMenu ? "메뉴" : "딸기시럽"}</h1>
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

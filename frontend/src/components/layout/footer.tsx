import React, { MouseEvent, useState } from "react";
import "../../styles/footer.css";
import IMGLawyLandLogo from "../../assets/image/lawyland_logo.svg";
import IMGOnOffArrow from "../../assets/image/footer_on_arrow.svg";

const Footer = () => {
	const [onContents, setOnContents] = useState<boolean>(false);
	const onClickFooterContentsOn = (e: MouseEvent<HTMLButtonElement>) => {
		e.currentTarget.classList.toggle("active");
		setOnContents((prev: boolean) => !prev);
	};
	return (
		<footer id="footer_container">
			<div id="footer_header">
				<img src={IMGLawyLandLogo} alt="LawyLand Logo" />
				<button onClick={onClickFooterContentsOn}>
					<img src={IMGOnOffArrow} alt="Footer Contents On Off Button" />
				</button>
			</div>
			{onContents && (
				<div id="footer_contents" className="font_color_white">
					made by ByuckChon
					<br />
					사업자등록번호 : 922-76-00287
					<br />
					대표 : 정민철 <br />
					문의 : lawyland@naver.com <br />
					주소 : 08049 서울특별시 양천구 신정로 7길 75, 양천 디지털 상상 캠퍼스 005호
				</div>
			)}
		</footer>
	);
};

export default Footer;

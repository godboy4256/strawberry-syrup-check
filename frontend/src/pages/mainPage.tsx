import * as React from "react";
import "../styles/mainpage.css";
import Slider from "react-slick";
import IMGStroberry from "./../assets/img/temp_st.svg";
import "./../styles/main.css";
import { Link } from "react-router-dom";

const MainPage = () => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};
	return (
		<>
			<div id="main_page_container">
				<h3 className="fs_25">실업급여 계산기</h3>
				<Slider {...settings}>
					<Link to="basic" className="main_slide_card">
						<button className="box_shadow_style01">
							<h4>기본형</h4>
							<img src={IMGStroberry} alt="기본형 이미지" />
							<p className="bg_color_main fs_18 font_color_white">이미 퇴사한 사람뿐 아니라 재직 중인 사람도</p>
						</button>
					</Link>
					<Link to="detail" className="main_slide_card">
						<button className="box_shadow_style01">
							<h4>상세형</h4>
							<img src={IMGStroberry} alt="기본형 이미지" />
							<p className="bg_color_main fs_18 font_color_white">근로형태, 퇴직사유 등 사용자가 직접 입력</p>
						</button>
					</Link>
					<Link to="multi" className="main_slide_card">
						<button className="box_shadow_style01">
							<h4>복수형</h4>
							<img src={IMGStroberry} alt="기본형 이미지" />
							<p className="bg_color_main fs_18 font_color_white">두 곳 이상의 회사에서 재직한 경우 합산</p>
						</button>
					</Link>
				</Slider>
			</div>
			<div className="tooltip">
				본 계산기는 법적 효력이 없습니다. <br />
				정확한 결과를 확인하시기 위해서는 관할 고용센터로 문의하시기 바랍니다.
			</div>
		</>
	);
};

export default MainPage;

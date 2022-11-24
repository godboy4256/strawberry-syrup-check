import * as React from "react";
import Slider from "react-slick";
import IMGTitleBasic from "./../assets/image/main_title_basic.svg";
import IMGTitleDetail from "./../assets/image/main_title_detail.svg";
import IMGTitleMulti from "./../assets/image/main_title_multi.svg";
import IMGIconBasic from "./../assets/image/new/main_basic_icon.svg";
import IMGSlidePrev from "./../assets/image/new/slide_prev.svg";
import IMGSlideNext from "./../assets/image/new/slide_next.svg";
import IMGIconDetail from "./../assets/image/new/main_detail_icon.svg";
import IMGIconMulti from "./../assets/image/new/main_multi_icon02.svg";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import { useState, useEffect } from "react";
import "../styles/mainpage.css";

const handler = {
	setSlideComment: undefined,
};

const SlideGuideDirection = () => {
	const [slideComment, setSlideComment] = useState(0);
	useEffect(() => {
		handler.setSlideComment = setSlideComment;
	}, []);
	return (
		<>
			<div id="slide_guide_direction">
				<div className="fs_14">{slideComment === 0 ? "" : slideComment === 1 ? "간단하게 계산해보고 싶다면?" : slideComment === 2 && "여러곳에서 근무하셨다면?"}</div>
				<div className="fs_14">{slideComment === 0 ? "더 상세한 계산을 원한다면?" : slideComment === 1 ? "여러곳에서 근무하셨다면?" : slideComment === 2 && ""}</div>
			</div>
			<div id="slide_guide_direction_icon">
				{slideComment !== 0 && <img className="left_icon" src={IMGSlidePrev} alt="Slide Prev UI" />}
				{slideComment !== 2 && <img className="right_icon" src={IMGSlideNext} alt="Slide Next UI" />}
			</div>
		</>
	);
};

const MainPage = () => {
	const settings = {
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		afterChange: (current) => {
			handler.setSlideComment(current);
		},
	};
	return (
		<>
			<Header title="딸기시럽" leftType="LOGO" leftLink="/" />
			<div id="main_page_container" className="full_height_layout">
				<div>
					<SlideGuideDirection />
					<h3 className="fs_25 lh_37 font_family_bold">실업급여 계산기</h3>
					<Slider {...settings}>
						<Link to="basic" className="main_slide_card">
							<button className="box_shadow_style01">
								<h4>
									<img src={IMGTitleBasic} alt="기본형 타이틀" />
								</h4>
								<img src={IMGIconBasic} alt="기본형 이미지" />
								<p className="bg_color_main fs_18 font_color_white font_family_bold lh_27">이미 퇴사한 사람뿐 아니라 재직 중인 사람도</p>
							</button>
						</Link>
						<Link to="detail" className="main_slide_card">
							<button className="box_shadow_style01">
								<h4>
									<img src={IMGTitleDetail} alt="상세형 타이틀" />
								</h4>
								<img src={IMGIconDetail} alt="상세형 이미지" />
								<p className="bg_color_main fs_18 font_color_white font_family_bold lh_27">근로형태, 퇴직사유 등 사용자가 직접 입력</p>
							</button>
						</Link>
						<Link to="multi" className="main_slide_card">
							<button className="box_shadow_style01">
								<h4>
									<img src={IMGTitleMulti} alt="복수형 타이틀" />
								</h4>
								<img src={IMGIconMulti} alt="복수형 이미지" />
								<p className="bg_color_main fs_18 font_color_white font_family_bold lh_27">두 곳 이상의 회사에서 재직한 경우 합산</p>
							</button>
						</Link>
					</Slider>
				</div>
			</div>
		</>
	);
};

export default MainPage;

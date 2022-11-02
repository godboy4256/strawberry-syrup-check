import React from "react";
import Button from "../inputs/button";
import "../../styles/retiree_container.css";
import IMGRetireeCharacter from "../../assets/img/strawberry_character_01.png";

const CalIsRetiree = ({ type }: { type: "기본형" | "상세형" | "복수형" }) => {
	return (
		<div id="retiree_container">
			<div id="retiree_type">{type}</div>
			<div id="retiree_main">
				<div id="retiree_character">
					<img src={IMGRetireeCharacter} alt="Basic Strawberry Character" />
				</div>
				<Button type="normal_main" text="퇴직자" click_func={() => {}} description="이미 퇴직한 당신을 위한 실업급여는?" />
				<Button type="normal_main" text="퇴직예정자" click_func={() => {}} description="재직중이지만 실업급여가 궁금하다면?" />
			</div>
			<button id="retiree_help" className="flex_left">
				퇴직사유 알아보기
			</button>
		</div>
	);
};

export default CalIsRetiree;

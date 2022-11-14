import React, { Dispatch, SetStateAction } from "react";
import Button from "../inputs/button";
import "../../styles/retiree.css";
import IMGRetireeCharacter from "../../assets/img/strawberry_character_01.png";

const CalIsRetiree = ({ handler, type }: { handler: any; type: "기본형" | "상세형" | "복수형" }) => {
	const onClickIsRetiree = (isRetiree: boolean) => {
		handler.SetPageVal("retired", isRetiree);
		handler.setCompState(2);
	};
	return (
		<div id="retiree_container">
			<div id="retiree_type">{type}</div>
			<div id="retiree_main">
				<div id="strobarry_character">
					<img src={IMGRetireeCharacter} alt="Basic Strawberry Character" />
				</div>
				<Button type="normal_main" text="퇴직자" click_func={() => onClickIsRetiree(true)} description="이미 퇴직한 당신을 위한 실업급여는?" />
				<Button type="normal_main" text="퇴직예정자" click_func={() => onClickIsRetiree(false)} description="재직중이지만 실업급여가 궁금하다면?" />
			</div>
			<button id="retiree_help" className="flex_left">
				퇴직사유 알아보기
			</button>
		</div>
	);
};

export default CalIsRetiree;

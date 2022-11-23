import React from "react";
import Button from "../inputs/Button";
import { Link } from "react-router-dom";
import IMGBasicEmoticon from "../../assets/image/new/basic.svg";
import IMGHelpIcon from "../../assets/image/new/help_icon.svg";
import "../../styles/retiree.css";
import Header from "../layout/Header";

const CalIsRetiree = ({ handler, type }: { handler: any; type: "기본형" | "상세형" | "복수형" }) => {
	const onClickIsRetiree = (isRetiree: boolean) => {
		handler.SetPageVal("retired", isRetiree);
		handler.setCompState(2);
	};
	return (
		<div className="full_height_layout">
			<Header title="퇴직자 vs 퇴직예정자" leftLink="/" leftType="BACK" />
			<div id="retiree_container">
				<div className="pd_810 fs_14">{type}</div>
				<div id="retiree_main">
					<div id="strobarry_character">
						<img src={IMGBasicEmoticon} alt="Basic Strawberry Emoticon" />
					</div>
					<Button type="normal_main" text="퇴직자" click_func={() => onClickIsRetiree(true)} description="이미 퇴직한 당신을 위한 실업급여는?" />
					<Button type="normal_main" text="퇴직예정자" click_func={() => onClickIsRetiree(false)} description="재직중이지만 실업급여가 궁금하다면?" />
				</div>
				<Link className="help_link pd_810" to="">
					<img src={IMGHelpIcon} alt="help icon" />
					퇴직사유 알아보기
				</Link>
			</div>
		</div>
	);
};

export default CalIsRetiree;

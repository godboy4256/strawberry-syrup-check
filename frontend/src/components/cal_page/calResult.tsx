import React from "react";
import { Link } from "react-router-dom";
import IMGRetireeCharacter from "../../assets/image/strawberry_character_01.png";
import Button from "../inputs/button";
import "../../styles/result.css";

const comments_arr = ["당신은 실업급여 수급대상자입니다.", "실업급여를 받으실 수 없습니다.", "지금도 가능해요!", "조금만 더 힘내요!"];

const CalResult = ({ result }) => {
	const commnet = result.succ && result.retired ? comments_arr[0] : !result.succ && result.retired ? comments_arr[1] : result.succ && !result.retired ? comments_arr[2] : !result.succ && !result.retired && comments_arr[3];
	const availableDay = result.availableDay && result.availableDay.split("-");
	return (
		<>
			<div className="pd_810">기본형 / {result.retired ? "퇴직자" : "퇴직예정자 "}</div>
			<div className="basic_side_padding">
				<div id="strobarry_character">
					<img src={IMGRetireeCharacter} alt="Basic Strawberry Character" />
				</div>
				<div id="result_container">
					<div id="result_comment01" className="fs_18">
						{commnet}
					</div>
					{result.succ ? (
						<div id="result_main">
							<h3 className="bg_color_main font_color_white flex_box flex_box_row_center flex_box_column_center">
								총 수령액 :<div className="font_color_white fs_25">{result.availableAmountCost.toLocaleString()}</div> 원
							</h3>
							<div id="result_main_content">
								<div id="result_day" className="fs_12">
									하루 <span className="font_color_main fs_12">{result.realDayPay.toLocaleString()}</span> 원을 <span className="font_color_main fs_12">{result.receiveDay}</span>일 동안
								</div>
								<div id="result_month">
									월 <span className="strong_red">{result.realMonthPay.toLocaleString()}</span> 원 받아요!
								</div>
							</div>
						</div>
					) : result.retired ? (
						<>
							<div id="result_disapproval" className="bg_color_main">
								<div className="flex_box font_color_white fs_14">
									현재 근무 일수: <div className="fs_25 font_color_white">{result.workingDays}</div> 일
								</div>
								<div className="flex_box font_color_white fs_14">
									부족한 근무 일수: <div className="fs_25 font_color_white">{result.requireDays}</div> 일
								</div>
							</div>
							<Link className="help_link result_disapproval_tip" to="/">
								피보험단위기간이란 무엇인가요?
							</Link>
							<Link className="help_link" to="/">
								근무일수가 부족하다면?
							</Link>
						</>
					) : (
						<>
							<div id="result_remaining_days">
								<div className="fs_12">{`${availableDay[0]}년 ${availableDay[1]}월 ${availableDay[2]}일`} 이후 퇴직시</div>
								<div className="fs_12">현 근무일수 {result.workingDays} 일</div>
							</div>
							<div id="result_main">
								<h3 className="bg_color_main font_color_white flex_box flex_box_row_center flex_box_column_center">
									총 수령액 :<div className="font_color_white fs_25">{result.availableAmountCost}</div> 원
								</h3>
								<div id="result_main_content">
									<div id="result_day" className="fs_12">
										하루 <span className="font_color_main fs_12">{result.dayPay.toLocaleString()}</span> 원을 <span className="font_color_main fs_12">{result.receiveDays}</span>일 동안
									</div>
									<div id="result_month">
										월 <span className="strong_red">{result.monthPay.toLocaleString()}</span> 원 받아요!
									</div>
								</div>
							</div>
							<Link className="help_link" to="/">
								피보험단위기간이란 무엇인가요?
							</Link>
						</>
					)}
					{result.succ && <div id="result_comment02">고생 많으셨습니다!</div>}
					{result.succ && (
						<div id="result_severance_pay" className="flex_box bg_color_main font_color_white flex_box_row_center flex_box_column_center">
							예상 퇴직금 : <div className="font_color_white fs_25">{result.availableAmountCost.toLocaleString()}</div> 원
						</div>
					)}
				</div>
				<div className="mini_tip">
					계약 내용 등 구체적인 사정에 따라 결과가 달라질 수 있습니다. <br />한 결과를 확인하시기 위해서는 관할 고용센터로 문의하시기 바랍니다.
				</div>
				<Link to="/">
					<Button text="홈으로" type="bottom" click_func={() => {}} />
				</Link>
			</div>
		</>
	);
};

export default CalResult;

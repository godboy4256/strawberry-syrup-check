import React from "react";
import { Link } from "react-router-dom";
import IMGRetireeCharacter from "../../assets/img/strawberry_character_01.png";
import Button from "../inputs/button";

const comments_arr = ["당신은 실업급여 수급대상자입니다.", "실업급여를 받으실 수 없습니다.", "지금도 가능해요!", "조금만 더 힘내요!"];

const CalResult = ({ result }) => {
	const commnet = result.succ && result.retired ? comments_arr[0] : !result.succ && result.retired ? comments_arr[1] : result.succ && !result.retired ? comments_arr[2] : !result.succ && !result.retired && comments_arr[3];
	return (
		<>
			<div className="pd_810">기본형 / {result.retired ? "퇴직자" : "퇴직예정자 "}</div>
			<div className="basic_side_padding">
				<div id="strobarry_character">
					<img src={IMGRetireeCharacter} alt="Basic Strawberry Character" />
				</div>
				<div className="result_container">
					<div>{commnet}</div>
					{result.succ ? (
						<div>
							<h3>
								총 수령액 :<span>{result.availableAmountCost}</span> 원
							</h3>
							<div>
								하루 <span>{result.realDayPay}</span> 원을 <span>{result.receiveDay}</span> 동안
								<span>월 {result.realMonthPay} 원 받아요!</span>
							</div>
						</div>
					) : result.retired ? (
						<div>
							<div>현재 근무 일수: {result.workingDays} 일</div>
							<div>부족한 근무 일수: {result.requireDays} 일</div>
						</div>
					) : (
						<>
							<div>2022년 01월 31일 이후 퇴직시 현 근무일수 20일</div>
							<div>
								<h3>
									총 수령액 :<span>{result.availableAmountCost}</span> 원
								</h3>
								<div>
									하루 <span>{result.realDayPay}</span> 원을 <span>{result.receiveDay}</span> 동안
									<span>월 {result.realMonthPay} 원 받아요!</span>
								</div>
							</div>
						</>
					)}
					{result.succ && <div>고생 많으셨습니다!</div>}
					{result.succ && (
						<div>
							예상 퇴직금 : <span>{result.availableAmountCost}</span>
						</div>
					)}
				</div>
				<div>
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

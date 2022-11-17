import React, { ChangeEvent, ReactElement, useState } from "react";
import IMGSelect from "../../assets/image/select_icon.svg";
import IMGNormalSelect from "../../assets/image/new/select_icon_normal.svg";
import "../../styles/select.css";
// import PopUp from "../common/PopUp";

const SelectInput = ({
	selected,
	options,
	label,
	type = "normal",
	popup_focus_template,
	params,
	callBack,
}: {
	selected?: number | string;
	options: string[] | number[];
	label?: string;
	type?: "popup" | "normal" | "date_normal";
	popup_focus_template?: ReactElement;
	params: string;
	callBack: CallableFunction;
}) => {
	const [onOptionList, setOptionList] = useState(false);
	const onClickOnOptionList = () => {
		setOptionList((prev) => !prev);
	};
	return (
		<>
			{type === "popup" ? (
				<>
					<div onClick={onClickOnOptionList}>{popup_focus_template}</div>
					{onOptionList && (
						<></>
						// <PopUp
						// 	contents={
						// 		<div className="select_popup">
						// 			{options.map((el: string, idx: number) => {
						// 				return (
						// 					<div onClick={() => {}} className="options" key={el + String(idx)}>
						// 						{el}
						// 					</div>
						// 				);
						// 			})}
						// 		</div>
						// 	}
						// 	buttons="none"
						// />
					)}
				</>
			) : type === "date_normal" ? (
				<div id={type} className="select_custom">
					<select
						onChange={(e: ChangeEvent<HTMLSelectElement>) => {
							callBack(params, e.currentTarget.value);
						}}
						defaultValue={selected}
					>
						{options.map((el: string | number, idx: number) => {
							return (
								<option key={idx + Date.now()} value={el}>
									{el}
								</option>
							);
						})}
					</select>
					<img src={IMGSelect} alt="Select Icon" />
				</div>
			) : (
				type === "normal" && (
					<>
						{label && <label className="fs_16 write_label">{label}</label>}
						<div id={type} className="select_custom">
							<select
								className="fs_14"
								onChange={(e: ChangeEvent<HTMLSelectElement>) => {
									e.currentTarget.parentElement.classList.add("active");
									callBack(params, e.currentTarget.value);
								}}
								defaultValue={selected}
							>
								{options.map((el: string | number, idx: number) => {
									return (
										<option className="fs_14" key={idx + Date.now()} value={el}>
											{el}
										</option>
									);
								})}
							</select>
							<div className="select_icon">
								<img src={IMGNormalSelect} alt="Select Icon" />
							</div>
						</div>
					</>
				)
			)}
		</>
	);
};

export default SelectInput;

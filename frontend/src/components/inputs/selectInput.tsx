import React, { ChangeEvent, ReactElement, useState } from "react";
import "../../styles/select.css";
import IMGSelect from "../../assets/image/select_icon.svg";
// import PopUp from "../common/PopUp";

const SelectInput = ({
	selected,
	options,
	type = "normal",
	popup_focus_template,
	params,
	callBack,
}: {
	selected: number | string;
	options: string[] | number[];
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
			) : (
				type === "normal" ||
				(type === "date_normal" && (
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
				))
			)}
		</>
	);
};

export default SelectInput;

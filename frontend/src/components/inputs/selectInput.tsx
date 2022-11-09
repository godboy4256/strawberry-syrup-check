import React, { ChangeEvent, MouseEvent, ReactElement, useState } from "react";
import "../../styles/select.css";
// import PopUp from "../common/PopUp";

const SelectInput = ({
	selected,
	options,
	type = "normal",
	popup_focus_template,
	params,
	callBack,
}: {
	selected: string;
	options: string[];
	type?: "popup" | "normal";
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
				type === "normal" && (
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
				)
			)}
		</>
	);
};

export default SelectInput;

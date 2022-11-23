import React, { ChangeEvent, ReactElement } from "react";
import IMGSelect from "../../assets/image/select_icon.svg";
import IMGNormalSelect from "../../assets/image/new/select_icon_normal.svg";
import { ClosePopup, CreatePopup } from "../common/Popup";
import "../../styles/select.css";

const PopupSelect = ({ options, callBack, params }: { options: string[] | number[]; callBack: CallableFunction; params: string }) => {
	return (
		<div className="popup_select_container">
			{options?.map((el: string | number, idx: number) => (
				<div
					className="popup_select_option font_color_main pd_810 fs_16 "
					key={String(Date.now()) + el}
					onClick={() => {
						callBack(params, idx);
						ClosePopup();
					}}
				>
					{el}
				</div>
			))}
		</div>
	);
};

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
	const onClickOnOptionList = () => {
		CreatePopup(undefined, <PopupSelect options={options} callBack={callBack} params={params} />, "none");
	};
	return (
		<>
			{type === "popup" ? (
				<div className="w_100" onClick={onClickOnOptionList}>
					{popup_focus_template}
				</div>
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

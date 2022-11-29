import React, { ChangeEvent, useState } from "react";
import { money_korean } from "../../utils/pays";
import "../../styles/input.css";

const NumberInput = ({
	params,
	label,
	by_date,
	num_unit,
	callBack,
	placeholder,
	k_parser = true,
	double = false,
}: {
	params?: string;
	label?: string;
	by_date?: string;
	num_unit?: string | string[];
	callBack: CallableFunction;
	placeholder?: string;
	k_parser?: boolean;
	double?: boolean;
}) => {
	const [value, setValue] = useState<string>("");
	let protoNum: number, toStringNum: string;
	const onChangeSetValue = (e: ChangeEvent<HTMLInputElement>) => {
		protoNum = Number(e.currentTarget.value.split(",").join(""));
		toStringNum = String(Number(protoNum).toLocaleString());
		if (isNaN(protoNum) || toStringNum.length > 11) {
			return;
		} else {
			callBack(params, protoNum);
			setValue(toStringNum);
		}
	};
	return (
		<>
			{!double ? (
				<div className="w_100">
					{label && <label className="write_label fs_16">{label}</label>}
					<div className={`input_style ${value ? "select" : ""}`}>
						{by_date && by_date}
						<input value={value} placeholder={placeholder && placeholder} className={value ? "select" : ""} onChange={onChangeSetValue} type="text" />
						{num_unit}
					</div>
					{k_parser ? <div className="fs_12 kr_value">{money_korean(String(value))} 원</div> : null}
				</div>
			) : (
				<div className="double_numberinput_container">
					{label && <label className="write_label fs_16">{label}</label>}
					<div className="double_numberinput_content">
						<div>
							<div className={`input_style ${value ? "select" : ""}`}>
								{by_date && by_date}
								<input value={value} placeholder={placeholder && placeholder} className={value ? "select" : ""} onChange={onChangeSetValue} type="text" />
								{num_unit[0]}
							</div>
							{k_parser ? <div className="fs_12 kr_value">{money_korean(String(value))} 원</div> : null}
						</div>
						<div>
							<div className={`input_style ${value ? "select" : ""}`}>
								{by_date && by_date}
								<input value={value} placeholder={placeholder && placeholder} className={value ? "select" : ""} onChange={onChangeSetValue} type="text" />
								{num_unit[1]}
							</div>
							{k_parser ? <div className="fs_12 kr_value">{money_korean(String(value))} 원</div> : null}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default NumberInput;

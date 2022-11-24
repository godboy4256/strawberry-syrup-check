import React, { ChangeEvent, useState } from "react";
import "../../styles/input.css";
import { money_korean } from "../../utils/pays";

const NumberInput = ({ params, label, by_date, num_unit, callBack }: { params?: string; label?: string; by_date?: string; num_unit?: string; callBack: CallableFunction }) => {
	const [value, setValue] = useState<string>("");
	let protoNum: number, toStringNum: string;
	const onChangeSetValue = (e: ChangeEvent<HTMLInputElement>) => {
		protoNum = Number(e.currentTarget.value.split(",").join(""));
		toStringNum = String(Number(protoNum).toLocaleString());
		if (isNaN(protoNum) || toStringNum.length > 11) {
			return;
		} else {
			callBack(params, [protoNum]);
			setValue(toStringNum);
		}
	};
	return (
		<div className="w_100">
			<div>{label && <label className="write_label fs_16">{label}</label>}</div>
			<div className={`input_style ${value ? "select" : ""}`}>
				{by_date && by_date}
				<input value={value} className={value ? "select" : ""} onChange={onChangeSetValue} type="text" />
				{num_unit}
			</div>
			<div className="fs_12 kr_value">{money_korean(String(value))} 원</div>
		</div>
	);
};

export default NumberInput;

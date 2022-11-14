import React, { ChangeEvent, ReactElement, useState } from "react";
import "../../styles/input.css";

class NumberInputHandler {
	protected arrNumberWord: string[] = new Array("", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구");
	protected arrDigitWord: string[] = new Array("", "십", "백", "천");
	protected arrManWord: string[] = new Array("", "만", "억", "조");
	public money_korean = (targetValue: string) => {
		let num_length = targetValue.split(",").join("").length;
		let han_value = "";
		let man_count = 0;
		for (let i = 0; i < num_length; i++) {
			let strTextWord = this.arrNumberWord[targetValue.split(",").join("").charAt(i)];
			if (strTextWord != "") {
				man_count++;
				strTextWord += this.arrDigitWord[(num_length - (i + 1)) % 4];
			}
			if (man_count != 0 && (num_length - (i + 1)) % 4 == 0) {
				man_count = 0;
				strTextWord = strTextWord + this.arrManWord[(num_length - (i + 1)) / 4];
			}
			han_value += strTextWord;
		}
		return han_value;
	};
}

const handler = new NumberInputHandler();
const NumberInput = ({ params, label, by_date, num_unit, callBack, guide }: { params?: string; label?: string; by_date?: string; num_unit?: string; callBack: CallableFunction; guide?: string | ReactElement }) => {
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
		<div className="w_100">
			<div>
				{label && <label className="write_label">{label}</label>}
				{guide && <>{guide}</>}
			</div>
			<div className={`input_style ${value ? "select" : ""}`}>
				{by_date && by_date}
				<input value={value} className={value ? "select" : ""} onChange={onChangeSetValue} type="text" />
				{num_unit}
			</div>
			<div className="fs_12 kr_value">{handler.money_korean(String(value))} 원</div>
		</div>
	);
};

export default NumberInput;

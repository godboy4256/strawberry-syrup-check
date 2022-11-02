import React from "react";
import "../../styles/input.css";

const NumberInput = ({ params, label, by_date, num_unit, callBack }: { params?: string; label?: string; by_date?: string; num_unit?: string; callBack: CallableFunction }) => {
	return (
		<div className="w_100">
			{label && <label className="write_label">{label}</label>}
			<div className="input_style">
				{by_date && by_date}{" "}
				<input
					onChange={(e) => {
						callBack(params, e.currentTarget.value);
					}}
					type="text"
				/>{" "}
				{num_unit}
			</div>
		</div>
	);
};

export default NumberInput;

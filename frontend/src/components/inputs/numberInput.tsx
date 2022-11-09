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
						if (e.currentTarget.value.length > 0) {
							e.currentTarget.classList.add("select");
							e.currentTarget.parentElement.classList.add("select");
						} else {
							e.currentTarget.classList.remove("select");
							e.currentTarget.parentElement.classList.remove("select");
						}
						callBack(params, Number(e.currentTarget.value));
					}}
					type="number"
				/>
				{num_unit}
			</div>
		</div>
	);
};

export default NumberInput;

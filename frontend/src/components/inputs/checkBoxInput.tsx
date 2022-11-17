import React, { useState } from "react";
import "../../styles/checkbox.css";

const checkList = [];

const _BoxTypeCheckBox = ({ el, type, callBack, params }: { el: string | number; type: string; callBack: CallableFunction; params: string }) => {
	const [onSelect, setOnSelect] = useState(false);
	return (
		<div
			className={`${type} ${onSelect ? "active" : ""}`}
			onClick={() => {
				setOnSelect((prev) => !prev);
				checkList.push(el);
				callBack(params, checkList);
			}}
		>
			{el}
		</div>
	);
};

const CheckBoxInput = ({ options, type, label, params, callBack }: { options: string[] | number[]; type: "box_type" | "square_type" | "circle_type"; label?: string; params: string; callBack: CallableFunction }) => {
	return (
		<>
			{label && <div className="fs_16 write_label">{label}</div>}
			<div className={`checkbox_container ${type}`}>
				{type === "box_type"
					? options.map((el: string | number) => {
							return <_BoxTypeCheckBox key={`${String(Date.now())}_for${el}`} el={el} type={type} params={params} callBack={callBack} />;
					  })
					: options.map((el: string | number, idx: number) => {
							return (
								<div className="checkbox_wrapper" key={`${String(Date.now())}_for${el}`}>
									<label className="fs_16" htmlFor={`${String(el)}_for${idx}`}>
										{el}
									</label>
									<div className="radio_input_box">
										<input id={`${String(el)}_for${idx}`} type="radio" name={label ? label : "any_radios"} className="checkbox_list" onChange={() => callBack(params, el)} />
										<span className="check_mark"></span>
									</div>
								</div>
							);
					  })}
			</div>
		</>
	);
};

export default CheckBoxInput;

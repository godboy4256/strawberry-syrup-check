import React, { Fragment, useState } from "react";
import "../../styles/checkbox.css";

const _BoxTypeCheckBox = ({ el, type, callBack, params }: { el: string | number; type: string; callBack: CallableFunction; params: string }) => {
	const checkList = [];
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

const CheckBoxInput = ({
	options,
	type,
	label,
	params,
	callBack,
}: {
	options: string[] | number[];
	type: "box_type" | "radio_box_type" | "circle_type" | "is_true_type";
	label?: string;
	params: string;
	callBack: CallableFunction;
}) => {
	return (
		<>
			{label && <div className="fs_16 write_label">{label}</div>}
			<div className={`checkbox_container ${type}`}>
				{type === "box_type"
					? options.map((el: string | number) => {
							return <_BoxTypeCheckBox key={`${String(Date.now())}_for${el}`} el={el} type={type} params={params} callBack={callBack} />;
					  })
					: type === "circle_type"
					? options.map((el: string | number, idx: number) => {
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
					  })
					: type === "radio_box_type"
					? options.map((el: string | number, idx: number) => {
							return (
								<Fragment key={`${String(Date.now())}_for${el}`}>
									<input id={`${String(el)}_for${idx}`} type="radio" name={label ? label : "any_radios"} className="checkbox_list" onChange={() => callBack(params, el)} />
									<label className="fs_16" htmlFor={`${String(el)}_for${idx}`}>
										{el}
									</label>
								</Fragment>
							);
					  })
					: type === "is_true_type" && (
							<div className="checkbox_wrapper">
								<label htmlFor={`${type}_box`} className="fs_16">
									{options[0]}
								</label>
								<div className="radio_input_box">
									<input
										id={`${type}_box`}
										type="checkbox"
										className="checkbox_list"
										onChange={(e) => {
											callBack(params, e.target.checked);
										}}
									/>
									<span className="check_mark"></span>
								</div>
							</div>
					  )}
			</div>
		</>
	);
};

export default CheckBoxInput;

import React, { MouseEventHandler } from "react";
import "../../styles/button.css";

const Button = ({
	text,
	type = "normal_main",
	click_func,
	description,
}: {
	text: string;
	type?: "normal_main" | "normal_sub" | "popup_confirm" | "popup_cancel" | "popup_ok" | "bottom";
	click_func: MouseEventHandler;
	description?: string;
}) => {
	return (
		<>
			<button onClick={click_func} className={type}>
				{text}
			</button>
			{description && <div className="fs_14 flex_right description">{description}</div>}
		</>
	);
};

export default Button;

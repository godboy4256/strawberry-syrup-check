import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import "../../styles/popup.css";
import Button from "../inputs/button";

interface IPopUpHandler {
	create_func: Dispatch<SetStateAction<ReactElement | string>>;
	confirm_func: () => void;
	cancel_func: () => void;
	title: string;
	popup_type: "confirm" | "only_check" | "date";
}

const PopUpHandler: IPopUpHandler = {
	create_func: undefined,
	confirm_func: undefined,
	cancel_func: undefined,
	title: undefined,
	popup_type: undefined,
};

const PopUpGlobal = () => {
	const [content, setContent] = useState<ReactElement | string | boolean>();
	PopUpHandler.create_func = setContent;
	const onClickConfirm = () => {
		if (PopUpHandler.confirm_func) PopUpHandler.confirm_func();
		setContent(false);
	};
	const onClickCancel = () => {
		if (PopUpHandler.cancel_func) PopUpHandler.cancel_func();
		setContent(false);
	};
	return (
		<>
			{content && (
				<div id="popup_background">
					<div id="popup_content" className={PopUpHandler.popup_type}>
						{PopUpHandler.title && <div id="popup_title">{PopUpHandler.title}</div>}
						{content && content}
						<div id={`${PopUpHandler.popup_type}_button_container`}>
							{PopUpHandler.popup_type === "date" ? (
								<>
									<Button text="취소" type="date_cancel" click_func={onClickConfirm} />
									<Button text="선택" type="date_select" click_func={onClickCancel} />
								</>
							) : PopUpHandler.popup_type === "only_check" ? (
								<Button text="예" type="popup_ok" click_func={() => {}} />
							) : (
								PopUpHandler.popup_type === "confirm" && (
									<>
										<Button text="예" type="popup_confirm" click_func={() => {}} />
										<Button text="아니오" type="popup_cancel" click_func={() => {}} />
									</>
								)
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

const CreatePopup = (title: string = undefined, content: ReactElement | string, popup_type: "confirm" | "only_check" | "date", confirm_func: () => void, cancel_func: () => void) => {
	PopUpHandler.create_func(content);
	PopUpHandler.title = title;
	PopUpHandler.confirm_func = confirm_func;
	PopUpHandler.cancel_func = cancel_func;
	PopUpHandler.popup_type = popup_type;
};

export { CreatePopup, PopUpGlobal };

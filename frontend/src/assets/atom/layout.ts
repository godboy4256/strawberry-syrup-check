import { atom } from "recoil";

export const headerState = atom({
	key: "HEADER_STATE_KEY_",
	default: { title: "딸기시럽", leftType: "LOGO", leftLink: "/" },
});

import { atom } from "recoil";

export const tabStateSalary = atom<string | undefined>({
  key: "tab_state_salary_atom",
  default: "all",
});

export const tabStateIsShortsArt = atom<boolean | undefined>({
  key: "tab_state_is_shorts_art_atom",
  default: false,
});

export const tabStateInputArt = atom<boolean | undefined>({
  key: "tab_state_input_art_atom",
  default: false,
});

export const tabBelongInput = atom<string>({
  key: "tab_state_belong_input",
  default: "개별 입력",
});

export const tabBelongArtIsShort = atom<string>({
  key: "tab_state_belong_is_short_art",
  default: "예술인",
});
export const tabBelongSpecialIsShort = atom<string>({
  key: "tab_state_belong_is_short_special",
  default: "특고",
});

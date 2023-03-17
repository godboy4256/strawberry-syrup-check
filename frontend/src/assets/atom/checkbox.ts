import { atom } from "recoil";

export const disabledCheck = atom<string | undefined>({
  key: "disabled_check_box_state_atom",
  default: "비장애인",
});

export const isSpecialCheck = atom<boolean>({
  key: "is_special_check_box_state_atom",
  default: false,
});

import { atom } from "recoil";

export const ageState = atom<string | undefined>({
  key: "age_atom",
  default: "",
});
export const enterDayeState = atom<string | undefined>({
  key: "enter_day_atom",
  default: "",
});
export const retiredDayeState = atom<string | undefined>({
  key: "retired_day_atom",
  default: "",
});
export const lastWorkDayState = atom<string | undefined>({
  key: "last_work_day_atom",
  default: "",
});
export const planToDoState = atom<string | undefined>({
  key: "plan_to_do_day_atom",
  default: "",
});
export const hasWorkState = atom<string | undefined>({
  key: "haswork_to_do_day_atom",
  default: "",
});

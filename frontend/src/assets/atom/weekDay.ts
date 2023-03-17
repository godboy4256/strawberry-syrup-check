import { atom } from "recoil";

export const weeKDayState = atom<boolean[]>({
  key: "week_day_state",
  default: [false, false, false, false, false, false, false],
});

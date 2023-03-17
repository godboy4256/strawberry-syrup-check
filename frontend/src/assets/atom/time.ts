import { atom } from "recoil";

export const setTimeCount = atom<number | string>({
  key: "day_time_count_atom",
  default: "",
});

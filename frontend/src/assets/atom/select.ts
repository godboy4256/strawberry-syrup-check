import { atom } from "recoil";

export const normalSelectState = atom<string | undefined | number>({
  key: "normal_select_atom",
  default: "",
});
export const dayWorkTimeSelectState = atom<string | undefined | number>({
  key: "day_work_time_select_atom",
  default: "",
});
export const jobCateSelectState = atom<string | undefined | number>({
  key: "job_cate_select_atom",
  default: "",
});

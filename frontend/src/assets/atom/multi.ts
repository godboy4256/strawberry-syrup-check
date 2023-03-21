import { atom } from "recoil";

export const duplicationDateCheck = atom<string[] | []>({
  key: "duplication_check_date_multi_atom",
  default: [],
});

export const duplicationWorkRecord = atom<string[] | []>({
  key: "duplication_check_date_multi_work_record_atom",
  default: [],
});

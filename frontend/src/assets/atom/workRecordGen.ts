import { atom } from "recoil";

export const workRecordState = atom<any>({
  key: "work_record_state_atom",
  default: [],
});

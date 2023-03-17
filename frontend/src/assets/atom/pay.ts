import { atom } from "recoil";

export const NormalSalary = atom<string | undefined>({
  key: "pay_input_atom_01",
  default: "",
});
export const SalaryTabInput01 = atom<string | undefined>({
  key: "salary_input_atom_01",
  default: "",
});
export const SalaryTabInput02 = atom<string | undefined>({
  key: "salary_input_atom_02",
  default: "",
});
export const SalaryTabInput03 = atom<string | undefined>({
  key: "salary_input_atom_03",
  default: "",
});
export const setSumOneYearPay = atom<string | undefined>({
  key: "sum_one_year_pay_atom",
  default: "",
});
export const setEmployYear = atom<string | undefined>({
  key: "sum_employ_year_atom",
  default: "",
});
export const setEmployMonth = atom<string | undefined>({
  key: "sum_employ_month_pay_atom",
  default: "",
});
export const setSumWorkDay = atom<string | undefined>({
  key: "sum_work_day_atom",
  default: "",
});
export const setDayAvgPay = atom<string | undefined>({
  key: "day_avg_pay_atom",
  default: "",
});

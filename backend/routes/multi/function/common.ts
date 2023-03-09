import { TaddData, TmainData } from "../schema";

export function checkArtOrSpecial(mainData: TmainData, filteredAddDatas: TaddData[]) {
	return mainData.workCate >= 2 && mainData.workCate <= 5 ? true : checkAddDatas(filteredAddDatas);

	function checkAddDatas(filteredAddDatas: TaddData[]) {
		const result = filteredAddDatas.some((addData) => addData.workCate >= 2 && addData.workCate <= 5);
		return result;
	}
}

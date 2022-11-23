export default class InputHandler {
	protected _Data: { [key: string]: {} } = {};
	constructor(keyList_: {}) {
		this._Data = keyList_;
	}
	GetPageVal = (key: string) => {
		return this._Data[key];
	};
	SetPageVal = (key: string, value: string) => {
		this._Data[key] = value;
	};
}
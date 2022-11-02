export default class InputHandler {
	protected _Data: { [key: string]: any } = {};
	constructor(keyList_) {
		console.log(this._Data);
		this._Data = keyList_;
	}
	GetPageVal = (key: string) => {
		return this._Data[key];
	};
	SetPageVal = (key: string, value: string) => {
		this._Data[key] = value;
	};
}

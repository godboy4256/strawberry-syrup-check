export default class InputHandler {
  public _Data: any = {};
  constructor(keyList_: {}) {
    this._Data = keyList_;
  }
  ResetVal = (reset_list: any) => {
    this._Data = reset_list;
    console.log(this._Data);
  };
  GetPageVal = (key: string) => {
    return this._Data[key];
  };
  SetPageVal = (key: string, value: any) => {
    this._Data[key] = value;
    console.log(this._Data);
  };
}

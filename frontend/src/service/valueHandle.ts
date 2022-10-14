class ValuesHandler {
  datas = {};

  GetInputValue(key: string, value: string) {
    this.datas[key] = value;
    console.log(this.datas[key]);
  }
}

export default ValuesHandler;

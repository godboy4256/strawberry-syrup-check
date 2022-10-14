import ValuesHandler from "./valueHandle";

class BasicCalHandler extends ValuesHandler {
  ActionBasicCal() {
    const to_server = {
      join_date: this.datas["join_date"],
      leave_date: this.datas["leave_date"],
      pay: this.datas["pay"],
    };
    console.log(to_server);
  }
}

export default BasicCalHandler;

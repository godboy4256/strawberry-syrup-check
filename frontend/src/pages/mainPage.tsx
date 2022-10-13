import * as React from "react";
import CheckBoxInput from "../components/inputs/checkBoxInput";
import DateInput from "../components/inputs/dateInput";
import Header from "../components/layout/header";
import "../styles/mainpage.css";
const MainPage = () => {
  return (
    <>
      {/* <Header title="딸기시럽" leftType="logo" /> */}
      <div id="main_page_container">
        <CheckBoxInput options={["메뉴1", "메뉴2"]} type="box_type" />
      </div>
    </>
  );
};

export default MainPage;

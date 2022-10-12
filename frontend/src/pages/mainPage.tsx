import * as React from "react";
import DateInput from "../components/inputs/dateInput";
import Header from "../components/layout/header";
import "../styles/mainpage.css";
const MainPage = () => {
  return (
    <>
      {/* <Header title="딸기시럽" leftType="logo" /> */}
      <DateInput />
      <div id="main_page_container"></div>
    </>
  );
};

export default MainPage;

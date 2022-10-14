import * as React from "react";
import NumberInput from "../components/inputs/numberInput";
import Header from "../components/layout/header";
import "../styles/mainpage.css";
import BasicCalPage from "./basiccalPage";
const MainPage = () => {
  return (
    <>
      <Header title="딸기시럽" leftType="logo" />
      <div id="main_page_container">
        <BasicCalPage />
      </div>
    </>
  );
};

export default MainPage;

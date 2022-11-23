import * as React from "react";
import { Outlet } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { PopUpGlobal } from "./components/common/Popup";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import "./styles/root.css";

function Root() {
	return (
		<RecoilRoot>
			<PopUpGlobal />
			<Header />
			<Outlet />
			<Footer />
		</RecoilRoot>
	);
}

export default Root;

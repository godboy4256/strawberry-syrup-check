import * as React from "react";
import { Outlet } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { PopUpGlobal } from "./components/common/PopUp";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
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

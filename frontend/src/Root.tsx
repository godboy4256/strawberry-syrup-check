import * as React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import "./styles/root.css";

function Root() {
	return (
		<>
			<Header leftType="logo" />
			<Outlet />
			{/* <Footer /> */}
		</>
	);
}

export default Root;

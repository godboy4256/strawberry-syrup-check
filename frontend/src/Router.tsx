import React from "react";
import { createBrowserRouter } from "react-router-dom";
import BasicCalPage from "./pages/basiccalPage";
import MainPage from "./pages/mainPage";
import Root from "./Root";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "",
				element: <MainPage />,
			},
			{
				path: "basic",
				element: <BasicCalPage />,
			},
		],
	},
]);

export default router;

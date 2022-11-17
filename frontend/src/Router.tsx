import React from "react";
import { createBrowserRouter } from "react-router-dom";
import BasicCalPage from "./pages/basiccalPage";
import DetailCalPage from "./pages/detailcalPage";
import MainPage from "./pages/mainPage";
import MultiCalPage from "./pages/multicalPage";
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
			{
				path: "detail",
				element: <DetailCalPage />,
			},
			{
				path: "multi",
				element: <MultiCalPage />,
			},
		],
	},
]);

export default router;

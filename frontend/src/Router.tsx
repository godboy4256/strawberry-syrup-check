import React from "react";
import { createBrowserRouter } from "react-router-dom";
import BasicCalPage from "./pages/Standad";
import DetailCalPage from "./pages/Detailed";
import MainPage from "./pages/MainPage";
import MultiCalPage from "./pages/Multi";
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

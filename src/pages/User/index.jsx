/** @format */

import React from "react";
import { Divider } from "antd";
import { useEffect } from "react";

import { useRoutes, Outlet } from "react-router-dom";
import router from "../../routers";

import "./index.css";

export default function User() {
	const element = useRoutes(router);
	useEffect(() => {}, []);
	return (
		<div className="content-box">
			<div className="header">
				<Divider orientationMargin={50} className="divider">
					<span className="header-title">招商银行 · 集卡活动</span>
				</Divider>
			</div>
			<Outlet>{element}</Outlet>
		</div>
	);
}

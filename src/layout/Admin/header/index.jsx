/** @format */

import React from "react";
import { Fragment, useEffect, useState } from "react";
import { menusList } from "../../../config";
import { useLocation } from "react-router-dom";
import { Divider } from "antd";
import "./index.css";

export default function Header() {
	const location = useLocation();
	const [title, setTitle] = useState("后台首页");
	useEffect(() => {
		let success = menusList.find((item) => {
			return item.key === location.pathname;
		});
		if (success) {
			setTitle(success.label);
		}
	}, [location.pathname]);
	return (
		<Fragment>
			<div className="admin-header">
				<span className="header-content">{title}</span>
				<span className="header-content">
					欢迎使用招商银行 · 集卡活动后台管理系统
				</span>
			</div>
			<Divider className="header-divider"></Divider>
		</Fragment>
	);
}

/** @format */

import React from "react";
import { useEffect } from "react";
import { Outlet, useRoutes, useNavigate } from "react-router-dom";
import { getUser } from "../../utils/storage";
import router from "../../routers";
import Admin from "../../layout/Admin";
import { message } from "antd";

export default function Backend() {
	const element = useRoutes(router);
	const navigate = useNavigate();
	useEffect(() => {
		if (!getUser().id) {
			message.warn("用户未登录");
			navigate("/user/login");
		} else if (getUser().label !== 0) {
			message.warn("用户权限不足");
			navigate("/home");
		}
	});
	return (
		<Admin>
			<Outlet>{element}</Outlet>
		</Admin>
	);
}

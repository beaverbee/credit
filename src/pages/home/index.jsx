/** @format */

import { message } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import { useRoutes, Outlet, useNavigate } from "react-router-dom";
import Person from "../../components/Person";
import router from "../../routers";
import { getUser } from "../../utils/storage";
import "./index.css";

export default function Home() {
	const element = useRoutes(router);
	const [userId, setUserId] = useState(-1);
	const navigate = useNavigate();
	useEffect(() => {
		if (getUser().id) {
			setUserId(getUser().id);
		} else {
			message.warn("用户未登录，请登录");
			navigate("/user/login");
		}
	}, [navigate]);
	return (
		<div className="home">
			<div className="home-content">
				<Person id={userId}></Person>
				<Outlet>{element}</Outlet>
			</div>
		</div>
	);
}

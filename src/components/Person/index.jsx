/** @format */

import React from "react";
import { Fragment, useEffect, useState } from "react";
import { Divider, Dropdown, Menu, message } from "antd";
import { useNavigate } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { removeUser } from "../../utils/storage";
import { getUser } from "../../utils/storage";
import axios from "../../utils/axios";
import qs from "qs";
import "./index.css";

export default function Person() {
	const [user, setUser] = useState({});
	const navigate = useNavigate();
	const handleUpdate = () => {
		navigate("/user/update", { id: user.id });
	};
	const handleLogout = () => {
		removeUser();
		navigate("/user/login");
	};
	const handleCancel = () => {
		// do something
		axios
			.post("/user/delete", qs.stringify({ id: user.id }))
			.then((value) => {
				if (value.status === 1 && value.data) {
					message.success("注销成功");
					removeUser();
					navigate("/user/register");
				} else {
					return Promise.reject();
				}
			})
			.catch(() => {
				message.error("Oops something error");
			});
	};

	const dropDown = (
		<Menu
			items={[
				{
					key: "1",
					label: (
						<span onClick={handleUpdate} className="menu-item">
							修改信息
						</span>
					),
				},
				{
					key: "2",
					label: (
						<span onClick={handleLogout} className="menu-item">
							退出登录
						</span>
					),
				},
				{
					key: "3",
					label: (
						<span onClick={handleCancel} className="menu-item">
							注销账户
						</span>
					),
					danger: true,
				},
			]}
		></Menu>
	);

	useEffect(() => {
		async function getUserMessage() {
			setUser(getUser());
		}
		getUserMessage();
	}, []);
	return (
		<Fragment>
			<div className="person-header">
				<span className="header-title">集卡游戏</span>
				<div className="header-menu">
					{getUser() && getUser().label === 0 ? (
						<span
							onClick={() => {
								navigate("/admin");
							}}
							style={{ marginRight: "10px", cursor: "pointer" }}
						>
							进入后台
						</span>
					) : undefined}
					<Dropdown overlay={dropDown}>
						<span className="menu-item">
							您好 {user.username} <DownOutlined></DownOutlined>
						</span>
					</Dropdown>
				</div>
			</div>
			<Divider className="person-divider"></Divider>
		</Fragment>
	);
}

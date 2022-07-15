/** @format */

import React from "react";
import { Fragment, useEffect, useState } from "react";
import { Divider, Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { removeUser } from "../../utils/storage";
import "./index.css";

export default function Person(props) {
	const { id } = props;
	const [user, setUser] = useState({});

	const navigate = useNavigate();

	const handleUpdate = () => {
		navigate("/user/update", { id });
	};
	const handleLogout = () => {
		removeUser();
		navigate("/user/login");
	};
	const handleCancel = () => {
		// do something
		navigate("/user/register");
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
		async function getUserMessage(id) {
			setUser({ username: "admin" });
			return;
		}
		getUserMessage(1);
	}, [id]);
	return (
		<Fragment>
			<div className="person-header">
				<span className="header-title">集卡游戏</span>
				<div className="header-menu">
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

/** @format */

import React from "react";
import { menusList } from "../../../config";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "./index.css";

export default function LeftNav() {
	const location = useLocation();
	const navigate = useNavigate();
	const onClick = (key) => {
		navigate(key);
	};
	return (
		<div className="nav">
			<ul className="menu">
				<li style={{ height: "150px", marginTop: "10px" }}>
					<img
						src={logo}
						alt="Beaver"
						width="150px"
						height="150px"
						className="profile"
					></img>
				</li>
				{menusList.map((menu) => (
					<li
						key={menu.key}
						className={`menuItem ${
							location.pathname === menu.key ? "selected" : undefined
						}`}
						onClick={() => {
							onClick(menu.key);
						}}
					>
						{menu.icon}
						<span>{menu.label}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

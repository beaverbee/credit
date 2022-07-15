/** @format */

import React from "react";
import { List } from "antd";
import GameItem from "../../../components/GameItem";
import "./index.css";

const data = [
	{
		id: "1",
		gamename: "g1",
		starttime: "2022/7/1",
		endtime: "2022/8/1",
		title: "welcome to g1",
		enable: true,
	},
	{
		id: "2",
		gamename: "g2",
		starttime: "2022/7/2",
		endtime: "2022/8/2",
		title: "welcome to g2",
		enable: true,
	},
	{
		id: "3",
		gamename: "g3",
		starttime: "2022/7/3",
		endtime: "2022/8/3",
		title: "welcome to g3",
		enable: false,
	},
];

export default function GameList() {
	return (
		<List
			itemLayout="horizontal"
			dataSource={data}
			pagination={{
				onChange: (page) => {
					console.log(page);
				},
				pageSize: 4,
			}}
			renderItem={(item) => (
				<List.Item>
					<GameItem game={item}></GameItem>
				</List.Item>
			)}
		/>
	);
}

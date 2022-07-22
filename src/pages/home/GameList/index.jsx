/** @format */

import React from "react";
import { useEffect, useState } from "react";
import { List, message, Spin } from "antd";
import { getUser } from "../../../utils/storage";
import axios from "../../../utils/axios";
import GameItem from "../../../components/GameItem";
import "./index.css";
import moment from "moment";

export default function GameList() {
	const [gameList, setGameList] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		function getGameList() {
			let game = [];
			axios
				.get(`/card/alllist/1/${moment().format("YYYY-MM-DD")}`)
				.then((value) => {
					if (value.status === 1 && value.data) {
						game = value.data.map((item) => {
							const { id, gamename, starttime, endtime } = item;
							return { id, gamename, starttime, endtime, enable: false };
						});
						return axios.get(`/config/userlist/${getUser().id}`);
					} else {
						return Promise.reject();
					}
				})
				.then((value) => {
					if (value.status === 1) {
						for (let i = 0; i < value.data.length; i++) {
							game.find(
								(item) => item.id === value.data[i].gameid
							).enable = true;
						}

						setGameList(game);
					} else {
						return Promise.reject();
					}
					setLoading(false);
				})
				.catch((e) => {
					message.error("Oops! something wrong");
					console.log(e);
				});
		}
		getGameList();
	}, [setLoading]);
	return (
		<Spin size="large" tip="加载中" spinning={loading}>
			<List
				itemLayout="horizontal"
				dataSource={gameList}
				pagination={{
					pageSize: 4,
				}}
				renderItem={(item) => (
					<List.Item>
						<GameItem game={item}></GameItem>
					</List.Item>
				)}
			/>
		</Spin>
	);
}

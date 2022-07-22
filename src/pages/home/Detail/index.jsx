/** @format */

import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./index.css";
import { message } from "antd";
import axios from "../../../utils/axios";

export default function Detail() {
	const [searchParams] = useSearchParams();
	const [title, setTitle] = useState("");
	const [gamename, setGamename] = useState("");
	const [starttime, setStarttime] = useState("");
	const [endtime, setEndtime] = useState("");
	const navigate = useNavigate();
	useEffect(() => {
		async function getMessage() {
			if (searchParams.has("gameid")) {
				//do something
				axios
					.get(`/card/list/${searchParams.get("gameid")}`)
					.then((value) => {
						if (value.status && value.data) {
							const { title, gamename, starttime, endtime } = value.data;
							setTitle(title);
							setGamename(gamename);
							setStarttime(starttime);
							setEndtime(endtime);
						} else {
							return Promise.reject();
						}
					})
					.catch(() => {
						message.error("Oops something wrong");
					});
				setTitle("welcome to g1");
			} else {
				message("访问出错");
				navigate(-1);
			}
		}
		getMessage();
	}, [navigate, searchParams]);
	return (
		<div className="detail">
			<span>游戏详情</span>
			<div className="game-detail-body">
				<span>{gamename}</span>
				<span>
					活动时间：{starttime}-{endtime}
				</span>
				<span>活动规则：{title}</span>
			</div>

			<span
				onClick={() => {
					navigate(-1);
				}}
			>
				返回游戏
			</span>
		</div>
	);
}

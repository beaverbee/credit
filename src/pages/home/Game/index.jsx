/** @format */

import React from "react";
import { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { message, Button, Image, Modal, Spin } from "antd";
import { getUser } from "../../../utils/storage";
import axios from "../../../utils/axios";
import "./index.css";
import { nanoid } from "nanoid";
import moment from "moment";

export default function Game() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [userGame, setUserGame] = useState({});
	const gameMsg = useRef();
	const [posible, setPosible] = useState([]);
	const [success, setSuccess] = useState(false);
	const [isShareVisiable, setIsShareVisiable] = useState(false);
	const [isAssistVisit, setIsAssistVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [joined, setjoined] = useState(false);

	const lotteryDraw = () => {
		if (userGame.number === 0) {
			message.warn("您抽奖次数不足，可分享以下链接获得抽奖次数");
		} else {
			const luckCode = Math.random();
			const newUserGame = { ...userGame };
			console.log("lotteryDraw", userGame);
			let card = 0;
			if (luckCode < posible[0]) {
				card = 1;
				newUserGame.p1++;
			} else if (luckCode >= posible[0] && luckCode < posible[1]) {
				card = 2;
				newUserGame.p2++;
			} else if (luckCode >= posible[1] && luckCode < posible[2]) {
				card = 3;
				newUserGame.p3++;
			} else if (luckCode >= posible[2] && luckCode < posible[3]) {
				card = 4;
				newUserGame.p4++;
			} else {
				card = 5;
				newUserGame.p5++;
			}
			newUserGame.number--;
			axios
				.post("/config/update", newUserGame)
				.then((value) => {
					if (value.status === 1 && value.data) {
						const v = {
							id: nanoid(),
							gamename: gameMsg.current.gamename,
							username: getUser().username,
							gameid: gameMsg.current.id,
							userid: getUser().id,
							actiontime: moment().format("YYYY-MM-DD HH:MM:SS"),
							action: `获得卡${card}`,
							label: 0,
						};
						return axios.post("/log/add", v);
					} else {
						return Promise.reject();
					}
				})
				.then((value) => {
					if (value.status === 1 && value.data) {
						setUserGame({ ...newUserGame });

						message.success(`恭喜抽到第${card}张卡`);
					}
				})
				.then(() => {
					const { p1, p2, p3, p4, p5 } = newUserGame;
					if (p1 && p2 && p3 && p4 && p5) {
						setSuccess(true);
						message.success("恭喜集齐所有的卡!");
						const newGameMsg = {
							...gameMsg.current,
							success: gameMsg.current.success + 1,
						};

						return axios.post("/card/update", newGameMsg);
					}
				})
				.catch(() => {
					message.error("活动太火爆了，请稍后再试");
				});
		}
	};

	const assistFriend = () => {
		const shareId = searchParams.get("shareId");
		if (userGame.assist === 0) {
			message.warn("您帮助的次数已达上限");
		} else {
			axios
				.get(`/config/${shareId}`) //获得朋友游戏配置
				.then((value) => {
					if (value.status && value.data.userid === getUser().id) {
						return Promise.reject("不能自己给自己助力");
					} else {
						const friendMsg = value.data;
						friendMsg.number += 1; //修改朋友游戏配置
						return axios.post(`/config/update`, friendMsg);
					}
				})
				.then((value) => {
					if (value.status === 1 && value.data) {
						userGame.number += 1;
						userGame.assist -= 1;

						return axios.post("/config/update", userGame); //修改自己游戏配置
					} else {
						return Promise.reject();
					}
				})
				.then((value) => {
					if (value.status === 1 && value.data) {
						const v = {
							id: nanoid(),
							gameid: gameMsg.current.id,
							gamename: gameMsg.current.gamename,
							userid: getUser().id,
							username: getUser().username,
							action: "助力",
							label: 0,
						};
						return axios.post(`/log/add`, v);
					} else {
						return Promise.reject();
					}
				})
				.then((value) => {
					if (value.status === 1 && value.data) {
						message.success("助力成功");
						setIsAssistVisible(false);
					} else {
						setIsAssistVisible(false);
						return Promise.reject();
					}
				})
				.then(() => {
					navigate(`/game?gameId=${searchParams.get("gameId")}`);
				})
				.catch((e) => {
					if (typeof e === "string") {
						message.error(e);
					} else {
						console.log(e);
					}
				});
		}
	};
	const joinGame = () => {
		const value = {
			id: nanoid(),
			username: getUser().username,
			userid: getUser().id,
			gamename: gameMsg.current.gamename,
			gameid: searchParams.get("gameId"),
			label: 0,
			action: "参加",
		};
		const initData = {
			userid: getUser().id,
			gameid: searchParams.get("gameId"),
			p1: 0,
			p2: 0,
			p3: 0,
			p4: 0,
			p5: 0,
			assist: 3,
			number: 3,
			first: 1, // 1:首次分享 0：已分享
			id: nanoid(),
		};
		axios
			.post("/config/add", initData)
			.then((value) => {
				if (value.status && value.data) {
					setUserGame(initData);
					console.log("/config/add", initData);
				} else {
					return Promise.reject();
				}
			})
			.then(() => {
				const newGameMsg = gameMsg.current;
				return axios.post("/card/update", {
					//游戏参与人数+1
					...newGameMsg,
					joined: newGameMsg.joined + 1,
				});
			})
			.then(() => {
				return axios.post("/log/add", value); //更新日志消息
			})
			.then(() => {
				if (searchParams.has("shareId")) {
					navigate(
						`/game?gameId=${searchParams.get(
							"gameId"
						)}&shareId=${searchParams.get("shareId")}`
					);
				} else {
					message.success("参加活动成功");
					navigate(`/game?gameId=${searchParams.get("gameId")}`);
				}
				return 1;
			})
			.then(() => {
				setjoined(true);
				setUserGame(initData);
			})
			.catch((e) => {
				message.error("当前活动太火爆请稍后再试");
				console.log(e);
			});
	};
	useEffect(() => {
		function getUserGame() {
			const gameId = searchParams.get("gameId");
			const userId = getUser().id;
			if (gameId && userId) {
				axios
					.get(`/card/list/${gameId}`)
					.then((value) => {
						if (value.status === 1 && value.data) {
							const { p1, p2, p3, p5 } = value.data;
							gameMsg.current = value.data;
							setPosible([p1, p1 + p2, p1 + p2 + p3, 1 - p5]);
						} else {
							return Promise.reject();
						}
					})
					.then(() => {
						return axios.get(`/config/usergame/${gameId}/${userId}`); //查询当前用户游戏配置信息
					})
					.then((value) => {
						if (value.data) {
							setUserGame(value.data);
							const { p1, p2, p3, p4, p5 } = value.data;
							if (p1 && p2 && p3 && p4 && p5) {
								setSuccess(true);
							}
						}
						return value.data;
					})
					.then((value) => {
						if (value) {
							setjoined(true);
						}
						setLoading(false);
						if (searchParams.has("shareId")) {
							setIsAssistVisible(true);
						}
					})
					.catch((e) => {
						console.log(e);
						if (typeof e === "string") {
							message.error(e);
						}
					});
			} else {
				message.error("访问错误");
				navigate("/");
			}
		}
		getUserGame();
	}, [navigate, searchParams]);
	return (
		<Spin size="large" tip="加载中" spinning={loading}>
			<div className="game">
				<div className="game-header">
					<span
						onClick={() => {
							navigate(`/detail?gameid=${gameMsg.current.id}`);
						}}
					>
						查看详情
					</span>
				</div>
				<div className="game-body">
					<div style={{ marginBottom: "60px", marginTop: "30px" }}>
						<span
							style={{
								fontSize: "24px",
								fontWeight: "bold",
							}}
						>
							{gameMsg.current ? gameMsg.current.gamename : undefined}
						</span>
					</div>
					<div className="game-card-list">
						{[
							[
								userGame.p1 > -1 ? userGame.p1 : 0,
								gameMsg.current ? gameMsg.current.p1dir : undefined,
							],
							[
								userGame.p2 > -1 ? userGame.p2 : 0,
								gameMsg.current ? gameMsg.current.p2dir : undefined,
							],
							[
								userGame.p3 > -1 ? userGame.p3 : 0,
								gameMsg.current ? gameMsg.current.p3dir : undefined,
							],
							[
								userGame.p4 > -1 ? userGame.p4 : 0,
								gameMsg.current ? gameMsg.current.p4dir : undefined,
							],
							[
								userGame.p5 > -1 ? userGame.p5 : 0,
								gameMsg.current ? gameMsg.current.p5dir : undefined,
							],
						].map((item, index) => (
							<div key={index}>
								<div className="game-card-list-item">
									<Image
										alt={`卡${index + 1}`}
										src={
											gameMsg.current
												? `http://localhost:3000/common/download?name=${item[1]}`
												: undefined
										}
										width="158px"
										height="180px"
									></Image>
									<div
										className="game-card-list-item-unable"
										style={{ display: item[0] === 0 ? "inline" : "none" }}
									></div>
								</div>
								<span className="game-card-list-item-desc">{` ${item[0]} 张`}</span>
							</div>
						))}
					</div>
					{joined ? (
						<div className="game-card-function">
							<div>
								剩余游戏次数:
								{userGame.number > -1 ? userGame.number : 3} 次
							</div>
							<div>
								剩余帮助次数:
								{userGame.assist > -1 ? userGame.assist : 3} 次
							</div>
							<div className="game-button">
								<Button onClick={lotteryDraw} disabled={success} type="primary">
									点击抽卡
								</Button>
								<Button
									type="ghost"
									onClick={() => {
										console.log(userGame);
										setIsShareVisiable(true);
									}}
								>
									点击分享
								</Button>
							</div>
							<div>
								{success ? (
									<span style={{ fontSize: "24px", fontWeight: "bold" }}>
										恭喜完成游戏
									</span>
								) : undefined}
							</div>
						</div>
					) : (
						<Button onClick={joinGame} type="primary" className="buttom">
							参加游戏！！
						</Button>
					)}
				</div>
				<div
					className="game-bottom"
					onClick={() => {
						navigate("/");
					}}
				>
					返回列表
				</div>
				<Modal
					title="点击分享"
					visible={isShareVisiable}
					okText="确认"
					cancelText="返回"
					onOk={() => {
						if (userGame.first === 1) {
							userGame.number += 2;
							userGame.first = 0;
							axios
								.post("/config/update", userGame)
								.then((value) => {
									if (value.status === 1 && value.data) {
										message.success("首次分享成功，抽奖机会+2");
									}
								})
								.catch(() => {
									message.error("Oops something wrong");
								});
						}
						setIsShareVisiable(false);
					}}
					onCancel={() => {
						setIsShareVisiable(false);
					}}
				>
					<p>将以下链接分享到朋友圈，让你的朋友助力完成游戏</p>
					<p>{`http://localhost:3000/game?gameId=${searchParams.get(
						"gameId"
					)}&&shareId=${userGame.id}`}</p>
				</Modal>
				<Modal
					title="助力完成游戏"
					visible={isAssistVisit}
					okText="助力"
					cancelText="稍后再说"
					onCancel={() => {
						setIsAssistVisible(false);
						navigate(`/game?gameId=${searchParams.get("gameId")}`);
					}}
					onOk={() => {
						if (!joined) {
							message.warn("您尚未参加游戏，请参加游戏后在为朋友助力");
							setIsAssistVisible(false);
						} else {
							assistFriend();
						}
					}}
				>
					<p>是否助力朋友完成集卡游戏?</p>
				</Modal>
			</div>
		</Spin>
	);
}

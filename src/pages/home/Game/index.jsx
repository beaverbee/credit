/** @format */

import React from "react";
import { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { message, Button } from "antd";

const gamemsg = {
	gameid: "1",
	gametitle: "welcome to g1",
	gamename: "g1",
	p1: 0.2,
	p2: 0.2,
	p3: 0.2,
	p4: 0.2,
	p5: 0.2,
};

export default function Game() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [userGame, setUserGame] = useState({});
	const gameMsg = useRef();
	const [posible, setPosible] = useState([]);
	const lotteryDraw = () => {
		if (userGame.number === 0) {
			message.warn("您抽奖次数不足，可分享以下链接获得抽奖次数");
		} else {
			const luckCode = Math.random();
			const newUserGame = { ...userGame };
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
			setUserGame(newUserGame);
			// updata userGame
			//final
			message.success(`恭喜抽到第${card}张卡`);
		}
	};

	useEffect(() => {
		async function getUserGame() {
			if (searchParams.has("userId") && searchParams.has("gameId")) {
				// do something
				const data = {
					userid: searchParams.get("userId"),
					gameid: searchParams.get("gameId"),
					p1: 1,
					p2: 2,
					p3: 3,
					p4: 4,
					p5: 0,
					assist: 3,
					number: 3,
				};
				setUserGame(data);
				// if (!data) {
				// 	// join the game
				// 	const newData = {
				// 		userid: searchParams.get("userId"),
				// 		gameid: searchParams.get("gameId"),
				// 		p1: 0,
				// 		p2: 0,
				// 		p3: 0,
				// 		p4: 0,
				// 		p5: 0,
				// 		assist: 3,
				// 		number: 3,
				// 	};
				// 	//sent the data
				// }
				gameMsg.current = gamemsg;
			} else {
				message.error("访问错误");
				navigate("/");
			}
			const { p1, p2, p3, p5 } = gamemsg;
			setPosible([p1, p1 + p2, p1 + p2 + p3, 1 - p5]);
		}
		getUserGame();
	}, [navigate, searchParams]);
	return (
		<div>
			Game
			<div>
				游戏名称:{gameMsg.current ? gameMsg.current.gamename : undefined}
			</div>
			<div>
				游戏标题:{gameMsg.current ? gameMsg.current.gametitle : undefined}
			</div>
			<div>
				<Button onClick={lotteryDraw}>点击抽卡</Button>
			</div>
			<div>{userGame.p1}</div>
			<div>{userGame.p2}</div>
			<div>{userGame.p3}</div>
			<div>{userGame.p4}</div>
			<div>{userGame.p5}</div>
		</div>
	);
}

/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function GameItem(props) {
	const { game } = props;
	const navigate = useNavigate();
	const handleClick = () => {
		navigate(`/game?gameId=${game.id}`);
	};
	return (
		<div className="game-list" onClick={handleClick}>
			<div className="avatar">{game.gamename}</div>
			<div className="game-body">
				<span className="game-list-item-title">{game.title}</span>
				<span>开始时间：{game.starttime}</span>
				<span>结束时间：{game.endtime}</span>
			</div>
			<div className="game-status">
				{game.enable ? <span>已参加</span> : <span>未参加</span>}
			</div>
		</div>
	);
}

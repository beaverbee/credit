/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { getUser } from "../../utils/storage";

export default function GameItem(props) {
	const { game } = props;
	const navigate = useNavigate();
	const handleClick = () => {
		console.log(game.id);
		navigate(`/game?gameId=${game.id}&userId=${getUser().id}`);
	};
	return (
		<div className="game-list" onClick={handleClick}>
			<div className="avatar">{game.gamename}</div>
			<div className="game-body">
				<span>{game.title}</span>
				<span>开始时间：{game.starttime}</span>
				<span>结束时间：{game.endtime}</span>
			</div>
			<div className="game-status">
				{game.enable ? <span>已参加</span> : <span>未参加</span>}
			</div>
		</div>
	);
}
